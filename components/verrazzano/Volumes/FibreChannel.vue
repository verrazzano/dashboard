<script>
// Added by Verrazzano
import Checkbox from '@/components/form/Checkbox';
import LabeledArrayList from '@/components/verrazzano/LabeledArrayList';
import LabeledInput from '@/components/form/LabeledInput';
import VerrazzanoHelper from '@/mixins/verrazzano/verrazzano-helper';

export default {
  name:       'FibreChannel',
  components: {
    Checkbox,
    LabeledArrayList,
    LabeledInput,
  },
  mixins: [VerrazzanoHelper],
  props:  {
    value: {
      type:    Object,
      default: () => ({})
    },
    mode: {
      type:    String,
      default: 'create'
    }
  },
  computed: {
    showTargetWWNs() {
      const lun = this.getField('lun');

      return !(typeof lun === 'undefined' || (typeof lun === 'string' && !lun));
    },
  },
  watch: {
    'value.lun'(neu, old) {
      if (typeof neu === 'undefined' || (typeof neu === 'string' && !neu)) {
        this.setFieldIfNotEmpty('targetWWNs', []);
      } else {
        this.setFieldIfNotEmpty('wwids', []);
      }
    }
  }
};
</script>

<template>
  <div>
    <div class="row">
      <div class="col span-4">
        <LabeledInput
          :value="getField('fsType')"
          :mode="mode"
          :label="t('verrazzano.config.fields.volumes.fc.fsType')"
          @input="setField('fsType', $event)"
        />
      </div>
      <div class="col span-4">
        <LabeledInput
          :value="getField('lun')"
          :mode="mode"
          :label="t('verrazzano.config.fields.volumes.fc.lun')"
          @input="setNumberField('lun', $event)"
        />
      </div>
      <div class="col span-4">
        <Checkbox
          :value="getField('readOnly')"
          :mode="mode"
          :label="t('verrazzano.config.fields.volumes.fc.readOnly')"
          @input="setBooleanField('readOnly', $event)"
        />
      </div>
    </div>
    <div class="spacer-small" />
    <div v-if="showTargetWWNs">
      <LabeledArrayList
        :value="getListField('targetWWNs')"
        :mode="mode"
        :value-label="t('verrazzano.config.fields.volumes.fc.targetWwn')"
        :add-label="t('verrazzano.config.buttons.addTargetWwn')"
        initial-empty-row
        @input="setFieldIfNotEmpty('targetWWNs', $event)"
      />
    </div>
    <div v-else>
      <LabeledArrayList
        :value="getListField('wwids')"
        :mode="mode"
        :value-label="t('verrazzano.config.fields.volumes.fc.wwid')"
        :add-label="t('verrazzano.config.buttons.addWwid')"
        initial-empty-row
        @input="setFieldIfNotEmpty('wwids', $event)"
      />
    </div>
  </div>
</template>

<style scoped>

</style>
