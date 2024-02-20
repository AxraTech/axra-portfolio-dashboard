import { gql } from "@apollo/client";
export const ALL_HOMES = gql`
  query MyQuery {
    home(order_by: { updated_at: desc }) {
      created_at
      description
      id
      image_url
      title
      updated_at
    }
    home_aggregate {
      aggregate {
        count
      }
    }
  }
`;

//get home pk
export const HOME_PK = gql`
  query MyQuery($id: Int!) {
    home_by_pk(id: $id) {
      created_at
      description
      id
      image_url
      title
      updated_at
    }
  }
`;
//create home
export const ADD_HOME = gql`
  mutation MyMutation(
    $description: String!
    $image_url: String!
    $title: String!
  ) {
    insert_home_one(
      object: {
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
    }
  }
`;

//update home
export const UPDATE_HOME = gql`
  mutation MyMutation(
    $id: Int!
    $description: String!
    $image_url: String!
    $title: String!
  ) {
    update_home_by_pk(
      pk_columns: { id: $id }
      _set: { description: $description, image_url: $image_url, title: $title }
    ) {
      created_at
      id
      description
      image_url
      updated_at
      title
    }
  }
`;
//delete home
export const DELETE_HOME = gql`
  mutation MyMutation($id: Int!) {
    delete_home_by_pk(id: $id) {
      id
    }
  }
`;
