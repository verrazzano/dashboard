<script>
// Added by Verrazzano
import Checkbox from '@/components/form/Checkbox';
import LabeledInput from '@/components/form/LabeledInput';
import LabeledSelect from '@/components/form/LabeledSelect';
import SELinuxOptions from '@/components/verrazzano/SELinuxOptions';
import SeccompProfile from '@/components/verrazzano/SeccompProfile';
import VerrazzanoHelper from '@/mixins/verrazzano/verrazzano-helper';

export default {
  name:       'ContainerSecurityContext',
  components: {
    Checkbox,
    LabeledInput,
    LabeledSelect,
    SELinuxOptions,
    SeccompProfile,
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
  data() {
    const allCapabilities = ['ALL',
      'AUDIT_CONTROL',
      'AUDIT_WRITE',
      'BLOCK_SUSPEND',
      'CHOWN',
      'DAC_OVERRIDE',
      'DAC_READ_SEARCH',
      'FOWNER',
      'FSETID',
      'IPC_LOCK',
      'IPC_OWNER',
      'KILL',
      'LEASE',
      'LINUX_IMMUTABLE',
      'MAC_ADMIN',
      'MAC_OVERRIDE',
      'MKNOD',
      'NET_ADMIN',
      'NET_BIND_SERVICE',
      'NET_BROADCAST',
      'NET_RAW',
      'SETFCAP',
      'SETGID',
      'SETPCAP',
      'SETUID',
      'SYSLOGSYS_ADMIN',
      'SYS_BOOT',
      'SYS_CHROOT',
      'SYS_MODULE',
      'SYS_NICE',
      'SYS_PACCT',
      'SYS_PTRACE',
      'SYS_RAWIO',
      'SYS_RESOURCE',
      'SYS_TIME',
      'SYS_TTY_CONFIG',
      'WAKE_ALARM'];

    return { allCapabilities };
  },
  watch: {
    privileged(neu) {
      if (neu) {
        this.setField('allowPrivilegeEscalation', true);
      }
    }
  }
};
</script>

<template>
  <div>
    <div class="row">
      <div class="col span-4">
        <Checkbox
          :value="getField('allowPrivilegeEscalation')"
          :mode="mode"
          :label="t('verrazzano.config.fields.containerSecurityContext.allowPrivilegeEscalation')"
          @input="setField('allowPrivilegeEscalation', $event)"
        />
        <div class="spacer-very-tiny" />
        <Checkbox
          :value="getField('privileged')"
          :mode="mode"
          :label="t('verrazzano.config.fields.containerSecurityContext.privileged')"
          @input="setField('privileged', $event)"
        />
        <div class="spacer-very-tiny" />
        <Checkbox
          :value="getField('runAsNonRoot')"
          :mode="mode"
          :label="t('verrazzano.config.fields.containerSecurityContext.runAsNonRoot')"
          @input="setField('runAsNonRoot', $event)"
        />
        <div class="spacer-very-tiny" />
        <Checkbox
          :value="getField('readOnlyRootFilesystem')"
          :mode="mode"
          :label="t('verrazzano.config.fields.containerSecurityContext.readOnlyRootFilesystem')"
          @input="setField('readOnlyRootFilesystem', $event)"
        />
      </div>
      <div class="col span-4">
        <LabeledInput
          :value="getField('runAsUser')"
          :mode="mode"
          :label="t('verrazzano.config.fields.containerSecurityContext.runAsUser')"
          @input="setField('runAsUser', $event)"
        />
        <div class="spacer-tiny" />
        <LabeledInput
          :value="getField('runAsGroup')"
          :mode="mode"
          :label="t('verrazzano.config.fields.containerSecurityContext.runAsGroup')"
          @input="setField('runAsGroup', $event)"
        />
      </div>
      <div class="col span-4">
        <LabeledSelect
          :value="getField('procMount')"
          :mode="mode"
          :label="t('verrazzano.config.fields.containerSecurityContext.procMount')"
          :options="[
            {
              value: 'DefaultProcMount',
              label: t('verrazzano.config.values.types.procMount.defaultProcMount')
            },
            {
              value: 'UnmaskedProcMount',
              label: t('verrazzano.config.values.types.procMount.unmaskedProcMount')
            }
          ]"
          option-key="value"
          option-label="label"
          @input="setField('procMount', $event)"
        />
      </div>
    </div>
    <div class="spacer-small" />
    <div class="row">
      <div class="col span-6">
        <LabeledSelect
          :value="getField('capabilities.add')"
          :taggable="true"
          :close-on-select="false"
          :mode="mode"
          :multiple="true"
          :label="t('workload.container.security.addCapabilities')"
          :options="allCapabilities"
          :disabled="isView"
          @input="setField('capabilities.add', $event)"
        />
      </div>
      <div class="col span-6">
        <LabeledSelect
          :value="getField('capabilities.drop')"
          :close-on-select="false"
          :taggable="true"
          :multiple="true"
          :mode="mode"
          :label="t('workload.container.security.dropCapabilities')"
          :options="allCapabilities"
          :disabled="isView"
          @input="setField('capabilities.drop', $event)"
        />
      </div>
    </div>
    <div class="spacer-small" />
    <div>
      <h4>{{ t('verrazzano.config.titles.containerSecurityContext.seLinuxOptions') }}</h4>
      <SELinuxOptions
        :value="getField('seLinuxOptions')"
        :mode="mode"
        @input="setFieldIfNotEmpty('seLinuxOptions', $event)"
      />
    </div>
    <div class="spacer-small" />
    <div>
      <h4>{{ t('verrazzano.config.titles.containerSecurityContext.seccompProfile') }}</h4>
      <SeccompProfile
        :value="getField('seccompProfile')"
        :mode="mode"
        @input="setFieldIfNotEmpty('seccompProfile', $event)"
      />
    </div>
  </div>
</template>

<style scoped>
  .spacer-very-tiny {
    padding: 5px 0 0 0;
  }
</style>
