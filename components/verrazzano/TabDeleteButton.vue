<script>
// Added by Verrazzano
import CreateEditView from '@/mixins/create-edit-view';

// this button fits next to the header at the top of TreeTabbed content

export default {
  name:   'TabDeleteButton',
  mixins: [CreateEditView],
  props:  {
    mode: {
      type:     String,
      required: true,
    },
    elementName: {
      type:     String,
      required: true,
    },
  },
};
</script>

<template>
  <button
    v-if="!isView"
    v-tooltip="t('verrazzano.common.buttons.deleteElement', { element: elementName })"
    type="button"
    class="btn role-link close btn-sm"
    @click="$emit('click', $event)"
  >
    <i class="icon icon-2x icon-x" />
  </button>
</template>
