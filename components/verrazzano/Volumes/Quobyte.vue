<script>
// Added by Verrazzano
import Checkbox from '@/components/form/Checkbox';
import LabeledInput from '@/components/form/LabeledInput';
import VerrazzanoHelper from '@/mixins/verrazzano/verrazzano-helper';

export default {
  name:       'Quobyte',
  components: {
    Checkbox,
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
    },
  },
};
</script>

<template>
  <div>
    <div class="row">
      <div class="col span-4">
        <LabeledInput
          :value="getField('registry')"
          :mode="mode"
          required
          :label="t('verrazzano.config.fields.volumes.quobyte.registry')"
          @input="setField('registry', $event)"
        />
      </div>
      <div class="col span-4">
        <LabeledInput
          :value="getField('volume')"
          :mode="mode"
          required
          :label="t('verrazzano.config.fields.volumes.quobyte.volume')"
          @input="setField('volume', $event)"
        />
      </div>
      <div class="col span-4">
        <LabeledInput
          :value="getField('tenant')"
          :mode="mode"
          :label="t('verrazzano.config.fields.volumes.quobyte.tenant')"
          @input="setField('tenant', $event)"
        />
      </div>
    </div>
    <div class="row">
      <div class="col span-4">
        <LabeledInput
          :value="getField('user')"
          :mode="mode"
          :label="t('verrazzano.config.fields.volumes.quobyte.user')"
          @input="setField('user', $event)"
        />
      </div>
      <div class="col span-4">
        <LabeledInput
          :value="getField('group')"
          :mode="mode"
          :label="t('verrazzano.config.fields.volumes.quobyte.group')"
          @input="setField('group', $event)"
        />
      </div>
      <div class="col span-4">
        <Checkbox
          :value="getField('readOnly')"
          :mode="mode"
          :label="t('verrazzano.config.fields.volumes.quobyte.readOnly')"
          @input="setField('readOnly', $event)"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
