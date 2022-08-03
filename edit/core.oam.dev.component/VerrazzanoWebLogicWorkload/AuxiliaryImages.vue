<script>
// Added by Verrazzano
import AuxiliaryImage from '@/edit/core.oam.dev.component/VerrazzanoWebLogicWorkload/AuxiliaryImage';
import ArrayListGrouped from '@/components/form/ArrayListGrouped';
import DynamicListHelper from '@/mixins/verrazzano/dynamic-list-helper';
import VerrazzanoHelper from '@/mixins/verrazzano/verrazzano-helper';

export default {
  name:       'AuxiliaryImages',
  components: {
    ArrayListGrouped,
    AuxiliaryImage
  },
  mixins: [VerrazzanoHelper, DynamicListHelper],
  props:  {
    value: {
      // parent object (e.g., pod spec)
      type:    Object,
      default: () => ({})
    },
    mode: {
      type:    String,
      default: 'create'
    },
    rootFieldName: {
      type:    String,
      default: 'auxiliaryImages'
    },
    namespacedObject: {
      type:     Object,
      required: true
    }
  },

  methods: {
    getRootFieldName() {
      return this.rootFieldName;
    }
  },
};
</script>

<template>
  <div>
    <ArrayListGrouped
      v-model="children"
      :mode="mode"
      :default-add-value="{ }"
      :add-label="t('verrazzano.weblogic.buttons.addAuxiliaryImage')"
      @add="addChild({})"
    >
      <template #remove-button="removeProps">
        <button
          v-if="showListRemoveButton(rootFieldName)"
          type="button"
          class="btn role-link close btn-sm"
          @click="deleteChild(children[removeProps.i])"
        >
          <i class="icon icon-2x icon-x" />
        </button>
        <span v-else />
      </template>
      <template #default="props">
        <AuxiliaryImage
          :value="props.row.value"
          :mode="mode"
          :namespaced-object="namespacedObject"
          @input="queueUpdate"
        />
      </template>
    </ArrayListGrouped>
    <div v-if="showEmptyListMessage(rootFieldName)">
      {{ t('verrazzano.weblogic.messages.noAuxiliaryImages') }}
    </div>
  </div>
</template>

<style scoped>
  @import "../verrazzano-styles.css";
</style>
