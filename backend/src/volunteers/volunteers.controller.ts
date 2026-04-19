import { Controller, Post, Get, Body, HttpException, HttpStatus } from '@nestjs/common';
import { VolunteersService } from './volunteers.service';

@Controller('volunteers')
export class VolunteersController {
  constructor(private readonly volunteersService: VolunteersService) {}

  @Post()
  async createVolunteer(@Body() data: any) {
    try {
      const result = await this.volunteersService.createVolunteer(data);
      return { success: true, data: result };
    } catch (error: any) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get()
  async getVolunteers() {
    try {
      const result = await this.volunteersService.getVolunteers();
      return { success: true, data: result };
    } catch (error: any) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
