<script>
import LabeledInput from '@/components/form/LabeledInput';
import TreeTab from '@/components/verrazzano/TreeTabbed/TreeTab';
import VerrazzanoHelper from '@/mixins/verrazzano/verrazzano-helper';

export default {
  name:       'LoggingTraitTab',
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
      this.treeTabLabel = this.t('verrazzano.common.tabs.loggingTrait');
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
              @click="$emit('deleteTrait', 'LoggingTrait')"
            >
              {{ t('verrazzano.common.buttons.deleteTrait') }}
            </button>
          </div>
        </div>
        <div class="spacer-small" />
      </div>
      <div class="row">
        <div class="col span-12">
          <LabeledInput
            :value="getField('trait.spec.loggingImage')"
            :mode="mode"
            required
            :placeholder="getNotSetPlaceholder(value, 'trait.spec.loggingImage')"
            :label="t('verrazzano.common.fields.loggingImage')"
            @input="setFieldIfNotEmpty('trait.spec.loggingImage', $event)"
          />
        </div>
      </div>
      <div class="spacer-small" />
      <div class="row">
        <div class="col span-12">
          <LabeledInput
            :value="getField('trait.spec.loggingConfig')"
            :mode="mode"
            required
            type="multiline"
            :placeholder="getNotSetPlaceholder(value, 'trait.spec.loggingConfig')"
            :label="t('verrazzano.common.fields.loggingConfig')"
            @input="setFieldIfNotEmpty('trait.spec.loggingConfig', $event)"
          />
        </div>
      </div>
    </template>
  </TreeTab>
</template>

<style scoped>

</style>
