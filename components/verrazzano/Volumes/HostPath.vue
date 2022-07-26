<script>
// Added by Verrazzano
import LabeledInput from '@/components/form/LabeledInput';
import LabeledSelect from '@/components/form/LabeledSelect';
import VerrazzanoHelper from '@/mixins/verrazzano/verrazzano-helper';

export default {
  name:       'HostPath',
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
  },
  computed: {
    typeOptions() {
      return [
        { value: '', label: this.t('verrazzano.config.values.types.volumes.hostPath.default') },
        { value: 'DirectoryOrCreate', label: this.t('verrazzano.config.values.types.volumes.hostPath.directoryOrCreate') },
        { value: 'Directory', label: this.t('verrazzano.config.values.types.volumes.hostPath.directory') },
        { value: 'FileOrCreate', label: this.t('verrazzano.config.values.types.volumes.hostPath.fileOrCreate') },
        { value: 'File', label: this.t('verrazzano.config.values.types.volumes.hostPath.file') },
        { value: 'Socket', label: this.t('verrazzano.config.values.types.volumes.hostPath.socket') },
        { value: 'CharDevice', label: this.t('verrazzano.config.values.types.volumes.hostPath.charDevice') },
        { value: 'BlockDevice', label: this.t('verrazzano.config.values.types.volumes.hostPath.blockDevice') },
      ];
    }
  }
};
</script>

<template>
  <div class="row">
    <div class="col span-6">
      <LabeledInput
        :value="getField('path')"
        :mode="mode"
        required
        :label="t('verrazzano.config.fields.volumes.hostPath.path')"
        @input="setField('path', $event)"
      />
    </div>
    <div class="col span-6">
      <LabeledSelect
        :value="getField('type')"
        :mode="mode"
        :options="typeOptions"
        option-key="value"
        option-label="label"
        :label="t('verrazzano.config.fields.volumes.hostPath.type')"
        @input="setField('type', $event)"
      />
    </div>
  </div>
</template>

<style scoped>

</style>
