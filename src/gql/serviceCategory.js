import { gql } from "@apollo/client";
//all service category
export const ALL_SERVICE_CATEGORY = gql`
  query aa($search: String!) {
    service_categories(
      where: { service_name: { _like: $search } }
      order_by: { updated_at: desc }
    ) {
      id
      created_at
      updated_at
      service_name
      image_url
    }
    service_categories_aggregate {
      aggregate {
        count
      }
    }
  }
`;

//get service category by pk
export const SERVICE_CATEGORY_BY_PK = gql`
  query aa($id: Int!) {
    service_categories_by_pk(id: $id) {
      id
      service_name
      image_url
      created_at
      updated_at
    }
  }
`;

//insert service category
export const ADD_SERVICE_CATEGORY = gql`
  mutation aa($service_name: String!, $image_url: String!) {
    insert_service_categories_one(
      object: { service_name: $service_name, image_url: $image_url }
    ) {
      id
      service_name
      image_url
    }
  }
`;

//update service category
export const UPDATE_SERVICE_CATEGORY = gql`
  mutation aa($id: Int!, $image_url: String!, $service_name: String!) {
    update_service_categories_by_pk(
      pk_columns: { id: $id }
      _set: { image_url: $image_url, service_name: $service_name }
    ) {
      id
      image_url
      service_name
    }
  }
`;

//delete service category
export const DELETE_SERVICE_CATEGORY = gql`
  mutation aa($id: Int!) {
    delete_service_categories_by_pk(id: $id) {
      id
    }
  }
`;
