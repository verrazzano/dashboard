<script>
import LabeledInput from '@/components/form/LabeledInput';
import TreeTab from '@/components/verrazzano/TreeTabbed/TreeTab';
import VerrazzanoHelper from '@/mixins/verrazzano/verrazzano-helper';

export default {
  name:       'ManualScalerTraitTab',
  components: {
    LabeledInput,
    TreeTab,
  },
  mixins: [VerrazzanoHelper],
  props:  {
    value: {
      type:     Object,
      required: true
    },
    mode: {
      type:    String,
      default: 'create'
    },
    tabName: {
      type:     String,
      required: true,
    },
    tabLabel: {
      type:    String,
      default: ''
    },
  },
  data() {
    return {
      treeTabName:     this.tabName,
      treeTabLabel:    this.tabLabel,
    };
  },
  created() {
    if (!this.treeTabLabel) {
      this.treeTabLabel = this.t('verrazzano.common.tabs.manualScalerTrait');
    }
  },
};
</script>

<template>
  <TreeTab :name="treeTabName" :label="treeTabLabel">
    <template #default>
      <div v-if="!isView">
        <div class="row">
          <div class="col span-10" />
          <div class="col span-2">
            <button
              type="button"
              class="btn role-tertiary add"
              data-testid="add-item"
              @click="$emit('deleteTrait', 'ManualScalerTrait')"
            >
              {{ t('verrazzano.common.buttons.deleteTrait') }}
            </button>
          </div>
        </div>
        <div class="spacer-small" />
      </div>
      <div class="row">
        <div class="col span-4">
          <LabeledInput
            :value="getField('trait.kind')"
            :mode="mode"
            disabled
            :label="t('verrazzano.common.fields.kind')"
            @input="setFieldIfNotEmpty('trait.kind', $event)"
          />
        </div>
        <div class="col span-4">
          <LabeledInput
            :value="getField('trait.spec.replicaCount')"
            :mode="mode"
            required
            type="number"
            min="0"
            :placeholder="getNotSetPlaceholder(value, 'trait.spec.replicaCount')"
            :label="t('verrazzano.common.fields.replicaCount')"
            @input="setNumberField('trait.spec.replicaCount', $event)"
          />
        </div>
      </div>
    </template>
  </TreeTab>
</template>

<style scoped>

</style>
