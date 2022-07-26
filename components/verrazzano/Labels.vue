<script>
// Added by Verrazzano
import KeyValue from '@/components/form/KeyValue';
import VerrazzanoHelper from '@/mixins/verrazzano/verrazzano-helper';

export default {
  name:       'Labels',
  components: { KeyValue },
  mixins:     [VerrazzanoHelper],
  props:      {
    // parent object (e.g., Container)
    value: {
      type:    Object,
      default: () => ({})
    },
    mode: {
      type:     String,
      required: true,
    },
    displaySideBySide: {
      type:    Boolean,
      default: false,
    },
    defaultContainerClass: {
      type:    String,
      default: '',
    },
    defaultSectionClass: {
      type:    String,
      default: '',
    }
  },

  computed: {
    containerClass() {
      return `${ this.displaySideBySide ? 'row' : '' } ${ this.defaultContainerClass }`.trim();
    },

    sectionClass() {
      return `${ this.displaySideBySide ? 'col span-6' : 'row' } ${ this.defaultSectionClass }`.trim();
    }
  }
};
</script>

<template>
  <div :class="containerClass">
    <div :class="sectionClass">
      <KeyValue
        key="labels"
        :value="getListField('labels')"
        :add-label="t('verrazzano.common.buttons.addLabel')"
        :mode="mode"
        :title="t('verrazzano.common.titles.labels')"
        :read-allowed="false"
        :value-can-be-empty="true"
        @input="setFieldIfNotEmpty('labels', $event)"
      />
    </div>
    <div class="spacer"></div>
    <div :class="sectionClass">
      <KeyValue
        key="annotations"
        :value="getListField('annotations')"
        :add-label="t('verrazzano.common.buttons.addAnnotation')"
        :mode="mode"
        :title="t('verrazzano.common.titles.annotations')"
        :read-allowed="false"
        :value-can-be-empty="true"
        @input="setFieldIfNotEmpty('annotations', $event)"
      />
    </div>
  </div>
</template>

<style scoped>

</style>
