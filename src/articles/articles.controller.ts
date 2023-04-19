import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  HttpStatus,
  NotFoundException,
  BadGatewayException,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  // MaxFileSizeValidator,
  FileTypeValidator,
} from '@nestjs/common';
import { CreateArticleDto } from './dto/create-article.dto';
import { Article as ArticleModel } from '@prisma/client';
import { ArticlesService } from './articles.service';
import { Express } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import path = require('path');
import { uuid } from 'uuidv4';

@Controller('articles')
export class ArticlesController {
  constructor(private readonly articleService: ArticlesService) {}

  //Get all articles
  @Get()
  getArticles(): Promise<ArticleModel[]> {
    try {
      return this.articleService.findAllArticles();
    } catch (err) {
      throw new NotFoundException();
    }
  }

  //Get article by id
  @Get(':id')
  getOneArticle(@Param('id') id: string): Promise<ArticleModel> {
    try {
      return this.articleService.findArticleById(Number(id));
    } catch (err) {
      throw new NotFoundException();
    }
  }

  //Create article
  @Post()
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './public/images',
        filename: (req, file, cb) => {
          const filename: string =
            path.parse(file.originalname).name.replace(/\s/g, '') + uuid();
          const extension: string = path.parse(file.originalname).ext;

          cb(null, `${filename}${extension}`);
        },
      }),
    }),
  )
  postArticle(
    @Body() createArticleDto: CreateArticleDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [new FileTypeValidator({ fileType: 'image/jpeg' })],
      }),
    )
    image: Express.Multer.File,
  ): Promise<ArticleModel> {
    try {
      const data = {
        ...createArticleDto,
        image: `/${image.path}`,
      };
      return this.articleService.createArticle(data);
    } catch (err) {
      throw new BadGatewayException();
    }
  }

  //Update article
  @Put(':id')
  updateArticle(
    @Param('id') id: number,
    @Body('content') content: string,
  ): string {
    console.log(id);
    try {
      this.articleService.updateArt({
        where: { id: Number(id) },
        data: { content: content },
      });

      return `Status code: ${HttpStatus.ACCEPTED}. Successfully updated the article with ID:${id}`;
    } catch (err) {
      throw new NotFoundException();
    }
  }

  //Delete article
  @Delete(':id')
  deleteArticle(@Param('id') id: string) {
    try {
      this.articleService.deleteArticle({ id: Number(id) });
      return `Status code: ${HttpStatus.ACCEPTED}. Successfully deleted the article with ${id}`;
    } catch (err) {
      throw new NotFoundException();
    }
  }
}
