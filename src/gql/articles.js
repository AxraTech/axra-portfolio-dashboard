import { gql } from "@apollo/client";
//get all articles
export const ALL_ARTICLES = gql`
  query MyQuery($search: String!) {
    article(
      where: { title: { _ilike: $search } }
      order_by: { updated_at: desc }
    ) {
      description
      id
      image_url
      title
      category
    }
    article_aggregate {
      aggregate {
        count
      }
    }
  }
`;
//get article pk
export const ARTICLE_PK = gql`
  query MyQuery($id: Int!) {
    article_by_pk(id: $id) {
      category
      created_at
      description
      id
      image_url
      title
      updated_at
    }
  }
`;

//delete article
export const DELETE_ARTICLE = gql`
  mutation MyMutation($id: Int!) {
    delete_article_by_pk(id: $id) {
      id
    }
  }
`;

//add article
export const ADD_ARTICLE = gql`
  mutation MyMutation(
    $category: String!
    $description: String!
    $image_url: String!
    $title: String!
  ) {
    insert_article_one(
      object: {
        category: $category
        description: $description
        image_url: $image_url
        title: $title
      }
    ) {
      category
      created_at
      description
      id
      image_url
      title
      updated_at
    }
  }
`;

//edit article
export const EDIT_ARTICLE = gql`
  mutation MyMutation(
    $id: Int!
    $category: String!
    $description: String!
    $image_url: String!
    $title: String!
  ) {
    update_article_by_pk(
      pk_columns: { id: $id }
      _set: {
        category: $category
        description: $description
        image_url: $image_url
        title: $title
      }
    ) {
      created_at
      description
      id
      image_url
      title
      updated_at
      category
    }
  }
`;
