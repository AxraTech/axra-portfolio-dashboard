import { gql } from "@apollo/client";
export const ALL_STAFFS = gql`
  query MyQuery($search: String!) {
    staff_info(
      order_by: { updated_at: desc }
      where: { name: { _ilike: $search } }
    ) {
      fk_users_id
      id
      image
      created_at
      start_join_date
      name
      position
      staff_ID
    }
    staff_info_aggregate {
      aggregate {
        count
      }
    }
  }
`;

//staff info by pk
export const STAFF_PK = gql`
  query MyQuery($id: Int!) {
    staff_info_by_pk(id: $id) {
      created_at
      fk_users_id
      id
      image
      name
      position
      start_join_date
      staff_ID
      updated_at
      staff_info_user {
        name
        id
      }
    }
  }
`;
// create staff
export const CREATE_STAFFS = gql`
  mutation MyMutation(
    $fk_users_id: Int!
    $image: String!
    $name: String!
    $position: String!
    $staff_ID: String!
    $start_join_date: date!
  ) {
    insert_staff_info_one(
      object: {
        fk_users_id: $fk_users_id
        image: $image
        name: $name
        position: $position
        staff_ID: $staff_ID
        start_join_date: $start_join_date
      }
    ) {
      created_at
      fk_users_id
      id
      image
      name
      position
      start_join_date
      staff_ID
    }
  }
`;

//get userId
export const USER_ID = gql`
  query MyQuery($id: Int!) {
    users_by_pk(id: $id) {
      name
      id
      phone
    }
  }
`;

//delete staff info
export const DELETE_STAFF = gql`
  mutation MyMutation($id: Int!) {
    delete_staff_info_by_pk(id: $id) {
      id
    }
  }
`;

//update staffinfo
export const EDIT_STAFF = gql`
  mutation MyMutation(
    $id: Int!
    $fk_users_id: Int!
    $image: String!
    $name: String!
    $position: String!
    $staff_ID: String!
    $start_join_date: date!
  ) {
    update_staff_info_by_pk(
      pk_columns: { id: $id }
      _set: {
        fk_users_id: $fk_users_id
        image: $image
        name: $name
        position: $position
        staff_ID: $staff_ID
        start_join_date: $start_join_date
      }
    ) {
      created_at
      fk_users_id
      id
      image
      name
      position
      start_join_date
      staff_ID
    }
  }
`;

//staff id
export const STAFF_ID = gql`
  query aa {
    staff_info {
      id
      staff_ID
    }
  }
`;
