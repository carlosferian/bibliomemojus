const { createFilePath } = require("gatsby-source-filesystem")
const path = require("path")

exports.createSchemaCustomization = ({ actions }) => {
  const { createTypes } = actions
  createTypes(`
    type MarkdownRemarkFrontmatter {
      ativo: Boolean
      ordem: Int
      nome: String
      cargo: String
      gt: String
      gt_nome: String
      instituicao: String
      mini_bio: String
      linkedin: String
      foto: String
    }
    type DuplicatasJsonLivro {
      titulo: String
      autor: String
      isbn: String
      editora: String
      ano: String
      exemplares: Int
      condicao: String
      obs: String
    }
    type DuplicatasJson implements Node {
      id: ID!
      biblioteca: String
      orgao: String
      uf: String
      esfera: String
      contato: String
      tituloEdital: String
      dataPublicacao: String
      prazo: String
      status: String
      observacoes: String
      livros: [DuplicatasJsonLivro]
    }
  `)
}

exports.onCreateNode = ({ node, actions, getNode }) => {
  const { createNodeField } = actions
  if (node.internal.type === "MarkdownRemark") {
    const parent = getNode(node.parent)
    createNodeField({ node, name: "collection", value: parent.sourceInstanceName })
    createNodeField({ node, name: "slug", value: createFilePath({ node, getNode }) })
  }
}

exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions
  const result = await graphql(`
    query {
      allMarkdownRemark(filter: { fields: { collection: { eq: "eventos" } } }) {
        nodes {
          fields { slug }
          frontmatter { url }
        }
      }
    }
  `)
  const template = path.resolve("./src/templates/evento.js")
  result.data.allMarkdownRemark.nodes.forEach(node => {
    if (node.frontmatter.url && node.frontmatter.url.startsWith("/")) {
      createPage({
        path: node.frontmatter.url,
        component: template,
        context: { slug: node.fields.slug },
      })
    }
  })
}
