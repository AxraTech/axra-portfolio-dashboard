import { gql } from "@apollo/client";
export const GET_ALL_CLAIM_FORM = gql`
  query MyQuery {
    claim_form(order_by: { updated_at: desc }) {
      claim_amount
      claimant_date
      created_at
      description_of_expense
      expense_type
      fk_staff_info_id
      id
      image
      status
      total_amount
      updated_at
    }
    claim_form_aggregate {
      aggregate {
        count
      }
    }
  }
`;

export const CLAIM_FORM_PK = gql`
  query MyQuery($id: Int!) {
    claim_form_by_pk(id: $id) {
      claim_amount
      claimant_date
      created_at
      description_of_expense
      expense_type
      fk_staff_info_id
      id
      image
      status
      total_amount
      updated_at
    }
  }
`;

//update status
export const UPDATE_STATUS = gql`
  mutation MyMutation($id: Int!, $status: String!) {
    update_claim_form_by_pk(
      pk_columns: { id: $id }
      _set: { status: $status }
    ) {
      status
      id
    }
  }
`;

//delete
export const DELETE_CLAIM_FORM = gql`
  mutation MyMutation($id: Int!) {
    delete_claim_form_by_pk(id: $id) {
      id
    }
  }
`;
