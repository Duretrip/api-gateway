import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { FileEntity } from './entities/file.entity';
import { Repository } from 'typeorm';
import { AllConfigType } from 'src/config/config.type';
import fs from 'fs'
import { DeleteObjectCommand, S3Client } from '@aws-sdk/client-s3';
import * as urlModule from 'url';

@Injectable()
export class FilesService {
  constructor(
    private readonly configService: ConfigService<AllConfigType>,
    @InjectRepository(FileEntity)
    private readonly fileRepository: Repository<FileEntity>,
  ) { }

  async uploadFile(
    file: Express.Multer.File | Express.MulterS3.File,
  ): Promise<FileEntity> {
    if (!file) {
      throw new HttpException(
        {
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            file: 'selectFile',
          },
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    const path = {
      local: `/${file.path
        }`,
      s3: (file as Express.MulterS3.File).location,
    };

    return this.fileRepository.save(
      this.fileRepository.create({
        path: path[
          this.configService.getOrThrow('file.driver', { infer: true })
        ],
      }),
    );
  }

  async deleteFile(fileId: string): Promise<void> {
    const file = await this.fileRepository.findOne({ where: { id: fileId } });

    if (!file) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'File not found',
        },
        HttpStatus.NOT_FOUND,
      );
    }

    const filePath = file.path;
    // Parse the URL to extract the pathname
    const parsedUrl = urlModule.parse(filePath);
    const pathname = parsedUrl.pathname || '';
    const absoluteFilePath = `${process.cwd()}${pathname}`

    if (this.configService.getOrThrow('file.driver', { infer: true }) === 'local') {
      // Local file deletion logic
      try {
        fs.unlinkSync(absoluteFilePath);
      } catch (error) {
        console.error(`Error deleting file: ${error.message}`);
        throw new HttpException(
          {
            status: HttpStatus.INTERNAL_SERVER_ERROR,
            error: 'Error deleting file',
          },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    } else if (this.configService.getOrThrow('file.driver', { infer: true }) === 's3') {
      // S3 file deletion logic
      const s3 = new S3Client({
        region: this.configService.get('file.awsS3Region', { infer: true }),
        credentials: {
          accessKeyId: this.configService.getOrThrow('file.accessKeyId', {
            infer: true,
          }),
          secretAccessKey: this.configService.getOrThrow(
            'file.secretAccessKey',
            { infer: true },
          ),
        },
      });

      // const key = path.replace(/^\//, ''); // Remove leading slash

      const params = {
        Bucket: this.configService.getOrThrow('file.awsDefaultS3Bucket', {
          infer: true,
        }),
        Key: filePath,
      };

      try {
        await s3.send(
          new DeleteObjectCommand(params),
        );
      } catch (error) {
        // Handle error, e.g., log or throw a custom exception
        console.error('Error deleting file from S3:', error);
        throw error;
      }
    }

    // Remove the file entry from the database
    await this.fileRepository.remove(file);
  }
}
