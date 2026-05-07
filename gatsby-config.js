module.exports = {
  siteMetadata: {
    title: `BIBLIOMEMOJUS`,
    description: `Rede Nacional de Bibliotecas Judiciárias — conecta profissionais dos cinco ramos do Poder Judiciário.`,
    siteUrl: `https://bibliomemojus.netlify.app/`,
  },
  plugins: [
    `gatsby-plugin-sitemap`,
    `gatsby-plugin-image`,
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    `gatsby-transformer-remark`,
    {
      resolve: `gatsby-source-filesystem`,
      options: { name: `images`, path: `${__dirname}/src/images` },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: { name: `noticias`, path: `${__dirname}/content/noticias` },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: { name: `eventos`, path: `${__dirname}/content/eventos` },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: { name: `publicacoes`, path: `${__dirname}/content/publicacoes` },
    },
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `BIBLIOMEMOJUS`,
        short_name: `Bibliomemojus`,
        start_url: `/`,
        background_color: `#16222F`,
        theme_color: `#9A7C3A`,
        display: `minimal-ui`,
        icon: `src/images/gatsby-icon.png`,
      },
    },
  ],
}
