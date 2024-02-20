import { gql } from "@apollo/client";
//get all web project
export const ALL_WEB_PROJECT = gql`
  query MyQuery {
    website_project(order_by: { updated_at: desc }) {
      created_at
      id
      image_url
      website_url
      updated_at
    }
    website_project_aggregate {
      aggregate {
        count
      }
    }
  }
`;

//get web prject pk
export const WEB_PROJECT_PK = gql`
  query MyQuery($id: Int!) {
    website_project_by_pk(id: $id) {
      created_at
      id
      image_url
      website_url
      updated_at
    }
  }
`;

//create web project
export const ADD_WEB_PROJECT = gql`
  mutation MyMutation($website_url: String!, $image_url: String!) {
    insert_website_project_one(
      object: { image_url: $image_url, website_url: $website_url }
    ) {
      created_at
      image_url
      id
      website_url
      updated_at
    }
  }
`;

//update app project
export const EDIT_WEB_PROJECT = gql`
  mutation MyMutation($id: Int!, $website_url: String!, $image_url: String!) {
    update_website_project_by_pk(
      pk_columns: { id: $id }
      _set: { website_url: $website_url, image_url: $image_url }
    ) {
      created_at
      id
      image_url
      website_url
      updated_at
    }
  }
`;

//delete app project
export const DELETE_WEB_PROJECT = gql`
  mutation MyMutation($id: Int!) {
    delete_website_project_by_pk(id: $id) {
      id
    }
  }
`;
export const UPDATE_POSITION = gql`
  mutation Update_Product_By_Id($id: Int!, $updateAt: timestamptz!) {
    update_website_project_by_pk(
      pk_columns: { id: $id }
      _set: { updated_at: $updateAt }
    ) {
      created_at
      id
    }
  }
`;
