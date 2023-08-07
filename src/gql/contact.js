import { gql } from "@apollo/client";
export const ALL_CONTACT = gql`
  query MyQuery {
    contact(order_by: { updated_at: desc }) {
      address
      created_at
      email
      end_time
      id
      image_url
      phone
      start_time
      updated_at
    }
    contact_aggregate {
      aggregate {
        count
      }
    }
  }
`;

//contact by pk
export const CONTACT_PK = gql`
  query MyQuery($id: Int!) {
    contact_by_pk(id: $id) {
      address
      created_at
      email
      end_time
      id
      image_url
      phone
      start_time
      updated_at
    }
  }
`;

//add contact
export const ADD_CONTACT = gql`
  mutation MyMutation(
    $address: String!
    $email: String!
    $end_time: timetz!
    $image_url: String!
    $phone: String!
    $start_time: timetz!
  ) {
    insert_contact_one(
      object: {
        address: $address
        email: $email
        end_time: $end_time
        image_url: $image_url
        phone: $phone
        start_time: $start_time
      }
    ) {
      address
      created_at
      email
      end_time
      id
      image_url
      phone
      start_time
      updated_at
    }
  }
`;

//edit contact
export const EDIT_CONTACT = gql`
  mutation MyMutation(
    $id: Int!
    $address: String!
    $email: String!
    $end_time: timetz!
    $image_url: String!
    $phone: String!
    $start_time: timetz!
  ) {
    update_contact_by_pk(
      pk_columns: { id: $id }
      _set: {
        address: $address
        email: $email
        end_time: $end_time
        image_url: $image_url
        phone: $phone
        start_time: $start_time
      }
    ) {
      address
      created_at
      end_time
      email
      id
      image_url
      phone
      start_time
      updated_at
    }
  }
`;

//delete contact
export const DELETE_CONTACT = gql`
  mutation MyMutation($id: Int!) {
    delete_contact_by_pk(id: $id) {
      id
    }
  }
`;
