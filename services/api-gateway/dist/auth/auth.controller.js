"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const auth_service_1 = require("./auth.service");
const dto_1 = require("@dure-trips/shared/dto");
const swagger_1 = require("@nestjs/swagger");
const entities_1 = require("@dure-trips/shared/entities");
const forget_password_dto_1 = require("apps/auth-microservice/src/dtos/forget-password.dto");
const decorators_1 = require("@dure-trips/shared/decorators");
const user_ennum_1 = require("@dure-trips/shared/enum/user.ennum");
let AuthController = class AuthController {
    constructor(authService) {
        this.authService = authService;
    }
    createUser(createUserDto) {
        return this.authService.createUser(createUserDto);
    }
    async login(existingUserDTO) {
        return this.authService.login(existingUserDTO);
    }
    getAllUsers() {
        return this.authService.getAllUsers();
    }
    async findOne(id) {
        console.log('iiddddd', id);
        return this.authService.getUser(id);
    }
    forgotPassword(forgetPasswordDto) {
        return this.authService.forgotPassword(forgetPasswordDto);
    }
};
__decorate([
    (0, common_1.Post)('register'),
    (0, swagger_1.ApiCreatedResponse)({ type: entities_1.UserEntity }),
    __param(0, (0, common_1.Body)(common_1.ValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_a = typeof dto_1.CreateUserDto !== "undefined" && dto_1.CreateUserDto) === "function" ? _a : Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "createUser", null);
__decorate([
    (0, common_1.Post)('login'),
    (0, swagger_1.ApiCreatedResponse)({ type: entities_1.UserEntity }),
    __param(0, (0, common_1.Body)(common_1.ValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_b = typeof dto_1.ExistingUserDTO !== "undefined" && dto_1.ExistingUserDTO) === "function" ? _b : Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, common_1.Get)('users'),
    (0, decorators_1.Roles)(user_ennum_1.Role.USER),
    (0, swagger_1.ApiOkResponse)({ type: entities_1.UserEntity, isArray: true }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "getAllUsers", null);
__decorate([
    (0, common_1.Get)('users/:id'),
    (0, swagger_1.ApiOkResponse)({ type: entities_1.UserEntity }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "findOne", null);
__decorate([
    (0, common_1.Put)('forgot-password'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    __param(0, (0, common_1.Body)(common_1.ValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_c = typeof forget_password_dto_1.ForgetPasswordDto !== "undefined" && forget_password_dto_1.ForgetPasswordDto) === "function" ? _c : Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "forgotPassword", null);
AuthController = __decorate([
    (0, common_1.Controller)('auth'),
    (0, swagger_1.ApiTags)('users'),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], AuthController);
exports.AuthController = AuthController;
//# sourceMappingURL=auth.controller.js.map