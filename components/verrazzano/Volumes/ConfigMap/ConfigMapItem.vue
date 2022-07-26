<script>
// Added by Verrazzano
import LabeledInput from '@/components/form/LabeledInput';
import LabeledSelect from '@/components/form/LabeledSelect';
import VerrazzanoHelper from '@/mixins/verrazzano/verrazzano-helper';

export default {
  name:       'ConfigMapItem',
  components: {
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
    },
    configMap: {
      type:     Object,
      required: true,
    }
  },
  data() {
    const keys = this.configMap?.data ? [...Object.keys(this.configMap.data)] : [];

    return { keys };
  },
  watch: {
    configMap(neu, old) {
      // this watcher gets invoked on page reload when switching from Edit YAML to Edit Config...
      if (this.didNamedObjectReallyChange(neu, old)) {
        this.keys = this.configMap?.data ? [...Object.keys(this.configMap.data)] : [];
        if (!this.keys.includes(this.getField('key'))) {
          this.setField('key', '');
        }
      }
    }
  },
};
</script>

<template>
  <div class="row">
    <div class="col span-4">
      <LabeledSelect
        :value="getField('key')"
        :mode="mode"
        :options="keys"
        :label="t('verrazzano.config.fields.volumes.configMap.items.key')"
        required
        @input="setField('key', $event)"
      />
    </div>
    <div class="col span-4">
      <LabeledInput
        :value="getField('path')"
        :mode="mode"
        :label="t('verrazzano.config.fields.volumes.configMap.items.path')"
        required
        @input="setField('path', $event)"
      />
    </div>
    <div class="col span-4">
      <LabeledInput
        :value="getField('mode')"
        :mode="mode"
        :label="t('verrazzano.config.fields.volumes.configMap.items.mode')"
        @input="setNumberField('mode', $event)"
      />
    </div>
  </div>
</template>

<style scoped>

</style>
