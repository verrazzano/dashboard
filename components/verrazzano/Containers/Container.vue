<script>
// Added by Verrazzano
import Checkbox from '@/components/form/Checkbox';
import ContainerLifecycle from '@/components/verrazzano/Containers/ContainerLifecycle';
import ContainerPorts from '@/components/verrazzano/Containers/ContainerPorts';
import ContainerProbe from '@/components/verrazzano/ContainerProbe';
import ContainerSecurityContext from '@/components/verrazzano/ContainerSecurityContext';
import EnvironmentVariables from '@/components/verrazzano/EnvironmentVariables';
import LabeledArrayList from '@/components/verrazzano/LabeledArrayList';
import LabeledInput from '@/components/form/LabeledInput';
import LabeledSelect from '@/components/form/LabeledSelect';
import VerrazzanoHelper from '@/mixins/verrazzano/verrazzano-helper';
import VolumeDevices from '@/components/verrazzano/VolumeDevices';
import VolumeMounts from '@/components/verrazzano/VolumeMounts';
import ContainerResources from '@/components/verrazzano/ContainerResources';

export default {
  name:       'Container',
  components: {
    ContainerResources,
    Checkbox,
    ContainerLifecycle,
    ContainerProbe,
    ContainerSecurityContext,
    ContainerPorts,
    EnvironmentVariables,
    LabeledArrayList,
    LabeledInput,
    LabeledSelect,
    VolumeDevices,
    VolumeMounts,
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
    isEphemeral: {
      type:    Boolean,
      default: false
    },
    namespacedObject: {
      type:     Object,
      required: true
    },
  },
  computed: {
    terminationMessagePolicyOptions() {
      return [
        { value: 'File', label: this.t('verrazzano.common.types.terminationMessagePolicy.file') },
        { value: 'FallbackToLogsOnError', label: this.t('verrazzano.common.types.terminationMessagePolicy.fallbackToLogsOnError') },
      ];
    }
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
          :label="t('verrazzano.common.fields.container.name')"
          @input="setField('name', $event)"
        />
      </div>
      <div class="col span-6">
        <LabeledInput
          :value="getField('image')"
          :mode="mode"
          :label="t('verrazzano.common.fields.container.image')"
          @input="setField('image', $event)"
        />
      </div>
      <div class="col span-3">
        <LabeledSelect
          :value="getField('imagePullPolicy')"
          :mode="mode"
          :options="imagePullPolicyOptions"
          option-key="value"
          option-label="label"
          :label="t('verrazzano.common.fields.container.imagePullPolicy')"
          @input="setField('imagePullPolicy', $event)"
        />
      </div>
    </div>
    <div v-if="isEphemeral">
      <div class="spacer-small" />
      <div class="row">
        <div class="col span-3">
          <LabeledInput
            :value="getField('targetContainerName')"
            :mode="mode"
            :placeholder="getNotSetPlaceholder(value, 'targetContainerName')"
            :label="t('verrazzano.common.fields.container.targetContainerName')"
            @input="setField('targetContainerName', $event)"
          />
        </div>
      </div>
    </div>
    <div class="spacer-small" />
    <div class="row">
      <div class="col span-6">
        <LabeledArrayList
          :value="getField('command')"
          :mode="mode"
          initial-empty-row
          :value-label="t('verrazzano.common.fields.container.command')"
          :add-label="t('verrazzano.common.buttons.addCommandArg')"
          @input="setFieldIfNotEmpty('command', $event)"
        />
      </div>
      <div class="col span-6">
        <LabeledArrayList
          :value="getField('args')"
          :mode="mode"
          initial-empty-row
          :value-label="t('verrazzano.common.fields.container.argument')"
          :add-label="t('verrazzano.common.buttons.addArgument')"
          @input="setFieldIfNotEmpty('args', $event)"
        />
      </div>
    </div>
    <div class="spacer-small" />
    <div class="row">
      <div class="col span-3">
        <Checkbox
          :value="getField('stdin')"
          :mode="mode"
          :label="t('verrazzano.common.fields.container.stdin')"
          @input="setBooleanField('stdin', $event)"
        />
        <div class="spacer-tiny" />
        <Checkbox
          :value="getField('stdinOnce')"
          :mode="mode"
          :label="t('verrazzano.common.fields.container.stdinOnce')"
          @input="setBooleanField('stdinOnce', $event)"
        />
        <div class="spacer-tiny" />
        <Checkbox
          :value="getField('tty')"
          :mode="mode"
          :label="t('verrazzano.common.fields.container.tty')"
          @input="setBooleanField('tty', $event)"
        />
      </div>
      <div class="col span-3">
        <LabeledInput
          :value="getField('workingDir')"
          :mode="mode"
          :label="t('verrazzano.common.fields.container.workingDir')"
          @input="setField('workingDir', $event)"
        />
      </div>
      <div class="col span-3">
        <LabeledInput
          :value="getField('terminationMessagePath')"
          :mode="mode"
          :label="t('verrazzano.common.fields.container.terminationMessagePath')"
          @input="setField('terminationMessagePath', $event)"
        />
      </div>
      <div class="col span-3">
        <LabeledSelect
          :value="getField('terminationMessagePolicy')"
          :mode="mode"
          :options="terminationMessagePolicyOptions"
          option-key="value"
          option-label="label"
          :label="t('verrazzano.common.fields.container.terminationMessagePolicy')"
          @input="setField('terminationMessagePolicy', $event)"
        />
      </div>
    </div>
    <div class="spacer-small" />
    <div>
      <h4>{{ t('verrazzano.common.titles.ports') }}</h4>
      <ContainerPorts
        v-model="value"
        :mode="mode"
      />
    </div>
    <div class="spacer-small" />
    <div>
      <h4>{{ t('verrazzano.common.titles.envVars') }}</h4>
      <EnvironmentVariables
        v-model="value"
        :mode="mode"
        :namespaced-object="namespacedObject"
      />
    </div>
    <div class="spacer-small" />
    <div>
      <h4>{{ t('verrazzano.common.titles.container.volumeMounts') }}</h4>
      <VolumeMounts
        v-model="value"
        :mode="mode"
      />
    </div>
    <div class="spacer-small" />
    <div>
      <h4>{{ t('verrazzano.common.titles.container.volumeDevices') }}</h4>
      <VolumeDevices
        v-model="value"
        :mode="mode"
      />
    </div>
    <div class="spacer-small" />
    <div>
      <h4>{{ t('verrazzano.common.titles.container.resources') }}</h4>
      <ContainerResources
        :value="getField('resources')"
        :mode="mode"
        @input="setFieldIfNotEmpty('resources', $event)"
      />
    </div>
    <div class="spacer-small" />
    <div>
      <h4>{{ t('verrazzano.common.titles.container.livenessProbe') }}</h4>
      <ContainerProbe
        :value="getField('livenessProbe')"
        :mode="mode"
        @input="setFieldIfNotEmpty('livenessProbe', $event)"
      />
    </div>
    <div class="spacer-small" />
    <div>
      <h4>{{ t('verrazzano.common.titles.container.readinessProbe') }}</h4>
      <ContainerProbe
        :value="getField('readinessProbe')"
        :mode="mode"
        is-readiness-probe
        @input="setFieldIfNotEmpty('readinessProbe', $event)"
      />
    </div>
    <div class="spacer-small" />
    <div>
      <h4>{{ t('verrazzano.common.titles.container.startupProbe') }}</h4>
      <ContainerProbe
        :value="getField('startupProbe')"
        :mode="mode"
        @input="setFieldIfNotEmpty('startupProbe', $event)"
      />
    </div>
    <div class="spacer-small" />
    <div>
      <h4>{{ t('verrazzano.common.titles.containerLifecycle') }}</h4>
      <ContainerLifecycle
        :value="getField('lifecycle')"
        :mode="mode"
        @input="setFieldIfNotEmpty('lifecycle', $event)"
      />
    </div>
    <div class="spacer-small" />
    <div>
      <h4>{{ t('verrazzano.common.titles.containerSecurityContext') }}</h4>
      <ContainerSecurityContext
        :value="getField('securityContext')"
        :mode="mode"
        @input="setFieldIfNotEmpty('securityContext', $event)"
      />
    </div>
  </div>
</template>

<style scoped>
  .spacer-tiny {
    padding: 5px 0 0 0;
  }
</style>
