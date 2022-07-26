<script>
// Added by Verrazzano
import ArrayList from '@/components/form/ArrayList';
import Checkbox from '@/components/form/Checkbox';
import KeyValue from '@/components/form/KeyValue';
import LabeledInput from '@/components/form/LabeledInput';
import LabeledSelect from '@/components/form/LabeledSelect';
import SELinuxOptions from '@/components/verrazzano/SELinuxOptions';
import SeccompProfile from '@/components/verrazzano/SeccompProfile';
import VerrazzanoHelper from '@/mixins/verrazzano/verrazzano-helper';

export default {
  name:       'PodSecurityContext',
  components: {
    LabeledSelect,
    ArrayList,
    Checkbox,
    KeyValue,
    LabeledInput,
    SELinuxOptions,
    SeccompProfile
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
        <div class="spacer-tiny" />
        <Checkbox
          :value="getField('runAsNonRoot')"
          :mode="mode"
          :label="t('verrazzano.config.fields.podSecurityContext.runAsNonRoot')"
          @input="setField('runAsNonRoot', $event)"
        />
      </div>
      <div class="col span-4">
        <LabeledInput
          :value="getField('runAsUser')"
          type="number"
          min="0"
          :label="t('workload.container.security.runAsUser')"
          :mode="mode"
          @input="setField('runAsUser', $event)"
        />
      </div>
      <div class="col span-4">
        <LabeledInput
          :value="getField('runAsGroup')"
          type="number"
          min="0"
          :label="t('workload.container.security.runAsGroup')"
          :mode="mode"
          @input="setField('runAsGroup', $event)"
        />
      </div>
    </div>
    <div class="spacer-small" />
    <div class="row">
      <div class="col span-6">
        <h5 class="text-label">
          <t k="workload.container.security.supplementalGroups" />
        </h5>
        <ArrayList
          :value="getField('supplementalGroups')"
          :add-label="t('verrazzano.config.buttons.addGroupID')"
          :mode="mode"
          @input="setField('supplementalGroups', $event)"
        />
      </div>
    </div>
    <div class="spacer-small" />
    <div class="row">
      <div class="col span-6">
        <LabeledInput
          :value="getField('fsGroup')"
          type="number"
          min="0"
          :label="t('workload.container.security.fsGroup')"
          :mode="mode"
          @input="setField('fsGroup', $event)"
        />
      </div>
      <div class="col span-6">
        <LabeledSelect
          :value="getField('fsGroupChangePolicy')"
          :label="t('verrazzano.config.fields.podSecurityContext.fsGroupChangePolicy')"
          :mode="mode"
          :options="[
            {
              value: 'Always',
              label: t('verrazzano.config.values.types.fsGroupChangePolicy.always')
            },
            {
              value: 'OnRootMismatch',
              label: t('verrazzano.config.values.types.fsGroupChangePolicy.onRootMismatch')
            }
          ]"
          option-key="value"
          option-label="label"
          @input="setField('fsGroupChangePolicy', $event)"
        />
      </div>
    </div>
    <div class="spacer-small" />
    <div class="row">
      <div class="col span-12">
        <KeyValue
          :value="getField('sysctls')"
          :title="t('workload.container.security.sysctls')"
          :key-label="t('workload.container.security.sysctlsKey')"
          :add-label="t('verrazzano.config.buttons.addSysctl')"
          :mode="mode"
          @input="setField('sysctls', $event)"
        >
          <template #title>
            <h4>
              {{ t('workload.container.security.sysctls') }}
            </h4>
          </template>
        </KeyValue>
      </div>
    </div>
    <div class="spacer-small" />
    <div>
      <h4>{{ t('verrazzano.config.titles.podSecurityContext.seLinuxOptions') }}</h4>
      <SELinuxOptions
        :value="getField('seLinuxOptions')"
        :mode="mode"
        @input="setFieldIfNotEmpty('seLinuxOptions', $event)"
      />
    </div>
    <div class="spacer-small" />
    <div>
      <h4>{{ t('verrazzano.config.titles.podSecurityContext.seccompProfile') }}</h4>
      <SeccompProfile
        :value="getField('seccompProfile')"
        :mode="mode"
        @input="setFieldIfNotEmpty('seccompProfile', $event)"
      />
    </div>
  </div>
</template>

<style lang="css" scoped>
  .spacer-tiny {
    padding: 5px 0 0 0;
  }
</style>
