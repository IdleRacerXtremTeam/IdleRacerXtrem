import {Controller, Get} from '@nestjs/common';
import {RedisService} from "./redis.service";

@Controller('redis')
export class RedisController {
  constructor(private readonly service: RedisService) {}

  @Get()
  public async get(){
  }
}