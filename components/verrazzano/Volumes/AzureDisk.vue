<script>
// Added by Verrazzano
import Checkbox from '@/components/form/Checkbox';
import LabeledInput from '@/components/form/LabeledInput';
import LabeledSelect from '@/components/form/LabeledSelect';
import VerrazzanoHelper from '@/mixins/verrazzano/verrazzano-helper';

export default {
  name:       'AzureDisk',
  components: {
    Checkbox,
    LabeledInput,
    LabeledSelect,
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
    cacheOptions() {
      return [
        {
          value: 'None',
          label: this.t('verrazzano.config.values.types.azureDisk.cachingMode.none')
        },
        {
          value: 'ReadOnly',
          label: this.t('verrazzano.config.values.types.azureDisk.cachingMode.readOnly')
        },
        {
          value: 'ReadWrite',
          label: this.t('verrazzano.config.values.types.azureDisk.cachingMode.readWrite')
        },
      ];
    },
    kindOptions() {
      return [
        {
          value: 'Shared',
          label: this.t('verrazzano.config.values.types.azureDisk.kind.shared')
        },
        {
          value: 'Dedicated',
          label: this.t('verrazzano.config.values.types.azureDisk.kind.dedicated')
        },
        {
          value: 'Managed',
          label: this.t('verrazzano.config.values.types.azureDisk.kind.managed')
        },
      ];
    }
  }
};
</script>

<template>
  <div>
    <div class="row">
      <div class="col span-4">
        <LabeledInput
          :value="getField('diskName')"
          :mode="mode"
          :label="t('verrazzano.config.fields.volumes.azureDisk.diskName')"
          required
          @input="setField('diskName', $event)"
        />
      </div>
      <div class="col span-4">
        <LabeledInput
          :value="getField('diskURI')"
          :mode="mode"
          :label="t('verrazzano.config.fields.volumes.azureDisk.diskUri')"
          required
          @input="setField('diskURI', $event)"
        />
      </div>
      <div class="col span-4">
        <LabeledSelect
          :value="getField('kind')"
          :mode="mode"
          :options="kindOptions"
          option-key="value"
          option-label="label"
          :label="t('verrazzano.config.fields.volumes.azureDisk.kind')"
          @input="setField('kind', $event)"
        />
      </div>
    </div>
    <div class="spacer-small" />
    <div class="row">
      <div class="col span-4">
        <LabeledInput
          :value="getField('fsType')"
          :mode="mode"
          :label="t('verrazzano.config.fields.volumes.azureDisk.fsType')"
          @input="setField('fsType', $event)"
        />
      </div>
      <div class="col span-4">
        <LabeledSelect
          :value="getField('cachingMode')"
          :mode="mode"
          :options="cacheOptions"
          option-key="value"
          option-label="label"
          :label="t('verrazzano.config.fields.volumes.azureDisk.cachingMode')"
          @input="setField('cachingMode', $event)"
        />
      </div>
      <div class="col span-4">
        <Checkbox
          :value="getField('readOnly')"
          :mode="mode"
          :label="t('verrazzano.config.fields.volumes.azureDisk.readOnly')"
          @input="setBooleanField('readOnly', $event)"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
