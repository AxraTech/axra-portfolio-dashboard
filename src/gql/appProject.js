import { gql } from "@apollo/client";
//get all app project
export const ALL_APP_PROJECT = gql`
  query MyQuery {
    application_project(order_by: { updated_at: desc }) {
      android_app_url
      created_at
      id
      image_url
      ios_app_url
      updated_at
    }
    application_project_aggregate {
      aggregate {
        count
      }
    }
  }
`;

//get app prject pk
export const APP_PROJECT_PK = gql`
  query MyQuery($id: Int!) {
    application_project_by_pk(id: $id) {
      android_app_url
      created_at
      id
      image_url
      ios_app_url
      updated_at
    }
  }
`;

//create app project
export const ADD_APP_PROJECT = gql`
  mutation MyMutation(
    $android_app_url: String!
    $image_url: String!
    $ios_app_url: String!
  ) {
    insert_application_project_one(
      object: {
        android_app_url: $android_app_url
        image_url: $image_url
        ios_app_url: $ios_app_url
      }
    ) {
      android_app_url
      created_at
      image_url
      id
      ios_app_url
      updated_at
    }
  }
`;

//update app project
export const EDIT_APP_PROJECT = gql`
  mutation MyMutation(
    $id: Int!
    $android_app_url: String!
    $image_url: String!
    $ios_app_url: String!
  ) {
    update_application_project_by_pk(
      pk_columns: { id: $id }
      _set: {
        android_app_url: $android_app_url
        image_url: $image_url
        ios_app_url: $ios_app_url
      }
    ) {
      android_app_url
      created_at
      id
      image_url
      ios_app_url
      updated_at
    }
  }
`;

//delete app project
export const DELETE_APP_PROJECT = gql`
  mutation MyMutation($id: Int!) {
    delete_application_project_by_pk(id: $id) {
      id
    }
  }
`;
