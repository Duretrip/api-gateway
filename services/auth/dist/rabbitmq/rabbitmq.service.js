"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RabbitmqService = void 0;
const common_1 = require("@nestjs/common");
const amqp = __importStar(require("amqplib"));
let RabbitmqService = class RabbitmqService {
    constructor() {
        this.connectToRabbitMQ();
    }
    async connectToRabbitMQ() {
        this.connection = await amqp.connect(process.env.AUTH_DATABASE_URL);
        this.channel = await this.connection.createChannel();
    }
    async publishMessage(queueName, message) {
        this.channel.sendToQueue(queueName, Buffer.from(JSON.stringify(message)));
    }
    async consumeMessages(queueName, callback) {
        this.channel.consume(queueName, (msg) => {
            const message = JSON.parse(msg.content.toString());
            callback(message);
            this.channel.ack(msg);
        });
    }
    async waitForResponse(correlationId) {
        return new Promise((resolve) => {
            this.channel.consume('api-gateway-queue', (msg) => {
                const message = JSON.parse(msg.content.toString());
                if (message.correlationId === correlationId) {
                    resolve(message.response);
                    this.channel.ack(msg);
                }
            });
        });
    }
};
exports.RabbitmqService = RabbitmqService;
exports.RabbitmqService = RabbitmqService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], RabbitmqService);
//# sourceMappingURL=rabbitmq.service.js.map