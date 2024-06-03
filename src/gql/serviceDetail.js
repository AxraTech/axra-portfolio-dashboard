import { gql } from "@apollo/client";
//get service detail
export const ALL_SERVICE_DETAIL = gql`
  query aa($fk_service_category_id: Int!) {
    service_details(
      where: { fk_service_category_id: { _eq: $fk_service_category_id } }
    ) {
      id
      service_category {
        service_name
        id
      }
      image_url
      service_description
      service_description_one
    }
    service_details_aggregate {
      aggregate {
        count
      }
    }
  }
`;

//get service detail pk
export const SERVICE_DETAIL_PK = gql`
  query MyQuery($id: Int!) {
    service_details_by_pk(id: $id) {
      created_at
      id
      image_url
      fk_service_category_id
      service_description
      service_description_one
      service_category {
        id
        service_name
      }
      updated_at
    }
  }
`;

//add service detail
export const ADD_SERVICE_DETAIL = gql`
  mutation add_service_details(
    $image_url: String!
    $service_description: String!
    $service_description_one: String!
    $fk_service_category_id: Int!
  ) {
    insert_service_details_one(
      object: {
        image_url: $image_url
        service_description: $service_description
        service_description_one: $service_description_one
        fk_service_category_id: $fk_service_category_id
      }
    ) {
      created_at
      id
      image_url
      service_description
      service_description_one
      service_category {
        id
        service_name
      }
      updated_at
    }
  }
`;

//delete service detail
export const DELETE_SERVICE_DETAIL = gql`
  mutation MyMutation($id: Int!) {
    delete_service_details_by_pk(id: $id) {
      id
    }
  }
`;

//update service detail
export const EDIT_SERVICE_DETAIL = gql`
  mutation edit_servce_detail(
    $id: Int!
    $image_url: String!
    $service_description: String!
    $service_description_one: String!
    $fk_service_category_id: Int!
  ) {
    update_service_details_by_pk(
      pk_columns: { id: $id }
      _set: {
        fk_service_category_id: $fk_service_category_id
        image_url: $image_url
        service_description: $service_description
        service_description_one: $service_description_one
      }
    ) {
      created_at
      id
      image_url
      service_description
      service_category {
        id
        service_name
      }
      updated_at
    }
  }
`;
