import { gql } from "@apollo/client";
export const GET_ALL_LEAVE_FORM = gql`
  query MyQuery {
    leave_form(order_by: { updated_at: desc }) {
      created_at
      end_date
      fk_staff_info_id
      form_type
      number_of_leaves
      id
      reason
      start_date
      status
      updated_at
      leave_form_staff_info {
        name
        id
      }
    }
    leave_form_aggregate {
      aggregate {
        count
      }
    }
  }
`;

export const LEAVE_FORM_PK = gql`
  query MyQuery($id: Int!) {
    leave_form_by_pk(id: $id) {
      created_at
      fk_staff_info_id
      end_date
      form_type
      id
      leave_form_staff_info {
        name
        id
      }
      number_of_leaves
      reason
      start_date
      status
      hourly_start_time
      hourly_end_time
      updated_at
    }
  }
`;

//update status
export const UPDATE_STATUS = gql`
  mutation MyMutation($id: Int!, $status: String!) {
    LeaveFormStatus(id: $id, status: $status) {
      error
      message
    }
  }
`;

//delete
export const DELETE_LEAVE_FORM = gql`
  mutation MyMutation($id: Int!) {
    delete_leave_form_by_pk(id: $id) {
      id
    }
  }
`;
