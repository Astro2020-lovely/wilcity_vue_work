<template>
  <table :class="wrapperClasses">
    <thead>
      <tr>
        <slot name="thead"></slot>
      </tr>
    </thead>
    <tbody>
      <slot name="tbody"></slot>
    </tbody>

    <slot name="tfoot"></slot>
  </table>
</template>

<script>
export default {
  name: "wil-table",
  props: {
    wrapperClasses: {
      type: String,
      default:
        "listing-table_table__2Cfzq wil-table-responsive-lg table-module__table"
    }
  }
};
</script>
