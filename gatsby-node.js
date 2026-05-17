const { createFilePath } = require("gatsby-source-filesystem")
const path = require("path")

exports.createSchemaCustomization = ({ actions }) => {
  const { createTypes } = actions
  // Garante campos de membros no schema mesmo sem arquivos .md em content/membros/
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
