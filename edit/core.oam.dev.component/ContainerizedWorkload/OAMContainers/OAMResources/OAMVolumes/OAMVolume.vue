<script>
// Added by Verrazzano
import ContainerizedWorkloadHelper from '@/mixins/verrazzano/containerized-workload-helper';
import LabeledInput from '@/components/form/LabeledInput';
import LabeledSelect from '@/components/form/LabeledSelect';
import OAMDisk from '@/edit/core.oam.dev.component/ContainerizedWorkload/OAMContainers/OAMResources/OAMVolumes/OAMDisk';

export default {
  name:       'OAMVolume',
  components: {
    LabeledInput,
    LabeledSelect,
    OAMDisk,
  },
  mixins: [ContainerizedWorkloadHelper],
  props:  {
    value: {
      type:    Object,
      default: () => ({})
    },
    mode: {
      type:    String,
      default: 'create',
    },
  },
  computed: {
    accessModeOptions() {
      return [
        { value: 'RW', label: this.t('verrazzano.containerized.types.accessMode.rw') },
        { value: 'RO', label: this.t('verrazzano.containerized.types.accessMode.ro') },
      ];
    },
    sharingPolicyOptions() {
      return [
        { value: 'Exclusive', label: this.t('verrazzano.containerized.types.sharingPolicy.exclusive') },
        { value: 'Shared', label: this.t('verrazzano.containerized.types.sharingPolicy.shared') },
      ];
    },
  }
};
</script>

<template>
  <div>
    <div class="row">
      <div class="col span-3">
        <LabeledInput
          :value="getField('name')"
          :mode="mode"
          required
          :placeholder="getNotSetPlaceholder(value, 'name')"
          :label="t('verrazzano.containerized.fields.volume.name')"
          @input="setFieldIfNotEmpty('name', $event)"
        />
      </div>
      <div class="col span-3">
        <LabeledInput
          :value="getField('mountPath')"
          :mode="mode"
          required
          :placeholder="getNotSetPlaceholder(value, 'mountPath')"
          :label="t('verrazzano.containerized.fields.volume.mountPath')"
          @input="setFieldIfNotEmpty('mountPath', $event)"
        />
      </div>
      <div class="col span-3">
        <LabeledSelect
          :value="getField('accessMode')"
          :mode="mode"
          :options="accessModeOptions"
          option-key="value"
          option-label="label"
          :placeholder="getNotSetPlaceholder(value, 'accessMode')"
          :label="t('verrazzano.containerized.fields.volume.accessMode')"
          @input="setFieldIfNotEmpty('accessMode', $event)"
        />
      </div>
      <div class="col span-3">
        <LabeledSelect
          :value="getField('sharingPolicy')"
          :mode="mode"
          :options="sharingPolicyOptions"
          option-key="value"
          option-label="label"
          :placeholder="getNotSetPlaceholder(value, 'sharingPolicy')"
          :label="t('verrazzano.containerized.fields.volume.sharingPolicy')"
          @input="setFieldIfNotEmpty('sharingPolicy', $event)"
        />
      </div>
    </div>
    <div class="spacer-small" />
    <div>
      <h4>{{ t('verrazzano.containerized.titles.disk') }}</h4>
      <OAMDisk
        :value="getField('disk')"
        :mode="mode"
        @input="setFieldIfNotEmpty('disk', $event)"
      />
    </div>
  </div>
</template>

<style scoped>

</style>
