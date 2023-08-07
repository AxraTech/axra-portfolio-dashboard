import { gql } from "@apollo/client";
//get service detail
export const ALL_SERVICE_DETAIL = gql`
  query MyQuery {
    service_detail(order_by: { updated_at: desc }) {
      banner_image_url
      created_at
      id
      image_url
      service_description
      service_name
      updated_at
    }
    service_detail_aggregate {
      aggregate {
        count
      }
    }
  }
`;

//get service detail pk
export const SERVICE_DETAIL_PK = gql`
  query MyQuery($id: Int!) {
    service_detail_by_pk(id: $id) {
      banner_image_url
      created_at
      id
      image_url
      service_description
      service_name
      updated_at
    }
  }
`;

//add service detail
export const ADD_SERVICE_DETAIL = gql`
  mutation add_service_detail(
    $banner_image_url: String!
    $image_url: String!
    $service_description: String!
    $service_name: String!
  ) {
    insert_service_detail_one(
      object: {
        banner_image_url: $banner_image_url
        image_url: $image_url
        service_description: $service_description
        service_name: $service_name
      }
    ) {
      banner_image_url
      created_at
      id
      image_url
      service_description
      service_name
      updated_at
    }
  }
`;

//delete service detail
export const DELETE_SERVICE_DETAIL = gql`
  mutation MyMutation($id: Int!) {
    delete_service_detail_by_pk(id: $id) {
      id
    }
  }
`;

//update service detail
export const EDIT_SERVICE_DETAIL = gql`
  mutation edit_servce_detail(
    $id: Int!
    $banner_image_url: String!
    $image_url: String!
    $service_description: String!
    $service_name: String!
  ) {
    update_service_detail_by_pk(
      pk_columns: { id: $id }
      _set: {
        banner_image_url: $banner_image_url
        image_url: $image_url
        service_description: $service_description
        service_name: $service_name
      }
    ) {
      banner_image_url
      created_at
      id
      image_url
      service_description
      service_name
      updated_at
    }
  }
`;
