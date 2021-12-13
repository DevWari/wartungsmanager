import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';

import { TokenDto } from '../../auth/auth/dto/LoginDto';
import { JwtAuthService } from '../../auth/jwt/jwt-auth.service';
import { ConfigService } from '../../config/config.service';
import { asResponse, DataResponse } from '../../lib/data-response';
import { USERS } from '../../routes';
import { AclService } from '../acl/acl.service';
import { ResetPasswordDto } from './dto/ChangePasswordDto';
import { CreateUserDto } from './dto/CreateUserDto';
import { FreeDataValueDto } from './dto/FreeDataValueDto';
import { UsersService } from './users.service';

@Controller(USERS.PREFIX)
@UseGuards(...USERS.USE_GUARDS)
@ApiBearerAuth()
@ApiTags('Users Administration')
export class UserController {
  constructor(
    public service: UsersService,
    public jwtAuthService: JwtAuthService,
    public aclService: AclService,
    public configService: ConfigService,
  ) {}

  @Get()
  @UseGuards(...USERS.ROUTES.GET_ALL.guards)
  async getMany(@Req() req: Request): Promise<DataResponse<unknown>> {
    return asResponse(await this.service.getAll(req.auth));
  }

  @Get(USERS.ROUTES.GET_ONE.path)
  @UseGuards(...USERS.ROUTES.GET_ONE.guards)
  async getOne(
    @Req() req: Request,
    @Param(USERS.ROUTES.GET_ONE.params.USER_ID) userId: string,
  ): Promise<DataResponse<unknown>> {
    return asResponse(await this.service.getByIdForTenant(req.auth, userId));
  }

  @Post(USERS.ROUTES.CREATE_ONE.path)
  @UseGuards(...USERS.ROUTES.CREATE_ONE.guards)
  async create(@Req() req: Request, @Body(new ValidationPipe()) data: CreateUserDto): Promise<any> {
    return asResponse(await this.service.create(req.auth, data));
  }

  @Put(USERS.ROUTES.UPDATE_ONE.path)
  @UseGuards(...USERS.ROUTES.UPDATE_ONE.guards)
  async update(
    @Req() req: Request,
    @Param(USERS.ROUTES.UPDATE_ONE.params.USER_ID) userId: string,
    @Body(new ValidationPipe()) data: CreateUserDto,
  ): Promise<DataResponse<unknown>> {
    // if (data.email) {
    //   await this.aclService.checkRights(null, userId, AclResource.Users, AclRight.ChangeEmail);
    // }

    // if (data.name) {
    //   await this.aclService.checkRights(null, userId, AclResource.Users, AclRight.ChangeUsername);
    // }

    return asResponse(await this.service.updateById(req.auth, userId, data));
  }

  @Delete(USERS.ROUTES.DELETE_ONE.path)
  @UseGuards(...USERS.ROUTES.DELETE_ONE.guards)
  async delete(
    @Req() req: Request,
    @Param(USERS.ROUTES.DELETE_ONE.params.USER_ID) userId: string,
  ): Promise<DataResponse<unknown>> {
    return asResponse(await this.service.deleteUserById(req.auth, userId));
  }

  @Put(USERS.ROUTES.ATTACH_ROLE.path)
  @UseGuards(...USERS.ROUTES.ATTACH_ROLE.guards)
  @ApiParam({ name: USERS.ROUTES.ATTACH_ROLE.params.USER_ID })
  @ApiParam({ name: USERS.ROUTES.ATTACH_ROLE.params.ROLE_ID })
  attachRole(
    @Param(USERS.ROUTES.ATTACH_ROLE.params.USER_ID) userId: string,
    @Param(USERS.ROUTES.ATTACH_ROLE.params.ROLE_ID) roleId: string,
  ): Promise<DataResponse<unknown>> {
    return this.service.attachRole(userId, roleId);
  }

  @Delete(USERS.ROUTES.DETACH_ROLE.path)
  @UseGuards(...USERS.ROUTES.DETACH_ROLE.guards)
  @ApiParam({ name: USERS.ROUTES.DETACH_ROLE.params.USER_ID })
  @ApiParam({ name: USERS.ROUTES.DETACH_ROLE.params.ROLE_ID })
  detachRole(
    @Param(USERS.ROUTES.DETACH_ROLE.params.USER_ID) userId: string,
    @Param(USERS.ROUTES.DETACH_ROLE.params.ROLE_ID) roleId: string,
  ): Promise<DataResponse<unknown>> {
    return this.service.detachRole(userId, roleId);
  }

  @Put(USERS.ROUTES.SET_FREE_DATA.path)
  @UseGuards(...USERS.ROUTES.SET_FREE_DATA.guards)
  @ApiParam({ name: USERS.ROUTES.SET_FREE_DATA.params.USER_ID })
  @ApiParam({ name: USERS.ROUTES.SET_FREE_DATA.params.KEY })
  setFreeData(
    @Param(USERS.ROUTES.SET_FREE_DATA.params.USER_ID) userId: string,
    @Param(USERS.ROUTES.SET_FREE_DATA.params.KEY) key: string,
    @Body() { value }: FreeDataValueDto,
  ): Promise<DataResponse<unknown>> {
    return this.service.setFreeData(userId, key, value);
  }

  @Get(USERS.ROUTES.GET_FREE_DATA.path)
  @UseGuards(...USERS.ROUTES.GET_FREE_DATA.guards)
  @ApiParam({ name: USERS.ROUTES.GET_FREE_DATA.params.USER_ID })
  getFreeData(
    @Param(USERS.ROUTES.GET_FREE_DATA.params.USER_ID) userId: string,
  ): Promise<DataResponse<unknown>> {
    return this.service.getFreeData(userId);
  }

  @Put(USERS.ROUTES.LOGOUT.path)
  @UseGuards(...USERS.ROUTES.LOGOUT.guards)
  @ApiParam({ name: USERS.ROUTES.LOGOUT.params.USER_ID })
  logout(
    @Param(USERS.ROUTES.LOGOUT.params.USER_ID) userId: string,
  ): Promise<DataResponse<boolean>> {
    return this.jwtAuthService.logout(userId);
  }

  @Post(USERS.ROUTES.CHANGE_PASSWORD_REQUEST.path)
  @UseGuards(...USERS.ROUTES.CHANGE_PASSWORD_REQUEST.guards)
  @ApiParam({ name: USERS.ROUTES.CHANGE_PASSWORD_REQUEST.params.USER_ID })
  async changePassword(
    @Req() req: Request,
    @Param(USERS.ROUTES.CHANGE_PASSWORD_REQUEST.params.USER_ID) userId: string,
    @Body() password: string,
  ): Promise<DataResponse<boolean>> {
    return await this.service.changePassword(req.auth, userId, password);
  }

  @Get(USERS.ROUTES.GET_RESET_PASSWORD_REQUEST.path)
  @UseGuards(...USERS.ROUTES.GET_RESET_PASSWORD_REQUEST.guards)
  @ApiParam({ name: USERS.ROUTES.GET_RESET_PASSWORD_REQUEST.params.USER_ID })
  getResetPasswordRequest(
    @Param(USERS.ROUTES.GET_RESET_PASSWORD_REQUEST.params.USER_ID) userId: string,
  ): Promise<DataResponse<TokenDto>> {
    return this.service.getResetPasswordToken(userId);
  }

  @Post(USERS.ROUTES.SEND_RESET_PASSWORD_REQUEST.path)
  @HttpCode(200)
  @UseGuards(...USERS.ROUTES.SEND_RESET_PASSWORD_REQUEST.guards)
  @ApiParam({ name: USERS.ROUTES.SEND_RESET_PASSWORD_REQUEST.params.USER_ID })
  sendResetPasswordRequest(
    @Param(USERS.ROUTES.SEND_RESET_PASSWORD_REQUEST.params.USER_ID) userId: string,
  ): Promise<DataResponse<TokenDto>> {
    return this.service.generateResetPasswordToken(userId);
  }

  @Post(USERS.ROUTES.RESET_PASSWORD.path)
  @HttpCode(200)
  @UseGuards(...USERS.ROUTES.RESET_PASSWORD.guards)
  @ApiParam({ name: USERS.ROUTES.RESET_PASSWORD.params.USER_ID })
  resetPassword(
    @Param(USERS.ROUTES.RESET_PASSWORD.params.USER_ID) userId: string,
    @Body(new ValidationPipe()) payload: ResetPasswordDto,
  ): Promise<DataResponse<boolean>> {
    return this.service.resetPassword(userId, payload.passwordResetToken, payload.newPassword);
  }

  @Get('test/getAll')
  async getAll(@Req() req: Request): Promise<unknown> {
    return this.service.getAll(req.auth);
  }
}
