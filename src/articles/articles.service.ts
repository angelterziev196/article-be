import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { Article, Prisma } from '@prisma/client';

@Injectable()
export class ArticlesService {
  constructor(private prisma: PrismaService) {}

  async createArticle(data: Prisma.ArticleCreateInput): Promise<Article> {
    return this.prisma.article.create({
      data,
    });
  }

  async findAllArticles() {
    return this.prisma.article.findMany();
  }

  async findArticleById(id: number) {
    return this.prisma.article.findUnique({
      where: {
        id: id,
      },
    });
  }

  async updateArt(params: {
    where: Prisma.ArticleWhereUniqueInput;
    data: Prisma.ArticleUpdateInput;
  }): Promise<Article> {
    console.log(params.data);
    const { data, where } = params;
    return this.prisma.article.update({
      data,
      where,
    });
  }

  async deleteArticle(where: Prisma.ArticleWhereUniqueInput): Promise<Article> {
    return this.prisma.article.delete({
      where,
    });
  }
}
