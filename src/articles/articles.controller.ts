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
  MaxFileSizeValidator,
  FileTypeValidator,
} from '@nestjs/common';
import { CreateArticleDto } from './dto/create-article.dto';
import { Article as ArticleModel } from '@prisma/client';
import { ArticlesService } from './articles.service';
import { Express } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';

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
  @UseInterceptors(FileInterceptor('image'))
  postArticle(
    @Body() createArticleDto: CreateArticleDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 50000 }),
          new FileTypeValidator({ fileType: 'image/jpeg' }),
        ],
      }),
    )
    image: Express.Multer.File,
  ): Promise<ArticleModel> {
    try {
      console.log(image.buffer.toString());
      const data = {
        ...createArticleDto,
        image: image.originalname.toString(),
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
