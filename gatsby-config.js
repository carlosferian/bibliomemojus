module.exports = {
  siteMetadata: {
    title: `BIBLIOMEMOJUS`,
    description: `Rede Nacional de Bibliotecas Judiciárias — conecta profissionais dos cinco ramos do Poder Judiciário.`,
    siteUrl: `https://bibliomemojus.netlify.app/`,
  },
  plugins: [
    `gatsby-plugin-image`,
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-source-filesystem`,
      options: { name: `images`, path: `${__dirname}/src/images` },
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
