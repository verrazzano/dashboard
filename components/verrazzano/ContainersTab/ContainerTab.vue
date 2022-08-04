<script>
// Added by Verrazzano
import Checkbox from '@/components/form/Checkbox';
import ContainerLifecycleTab from '@/components/verrazzano/ContainersTab/ContainerLifecycleTab';
import ContainerPortsTab from '@/components/verrazzano/ContainersTab/ContainerPortsTab';
import ContainerProbe from '@/components/verrazzano/ContainerProbe';
import ContainerResources from '@/components/verrazzano/ContainerResources';
import TabDeleteButton from '@/components/verrazzano/TabDeleteButton';
import EnvironmentVariables from '@/components/verrazzano/EnvironmentVariables';
import LabeledArrayList from '@/components/verrazzano/LabeledArrayList';
import LabeledInput from '@/components/form/LabeledInput';
import LabeledSelect from '@/components/form/LabeledSelect';
import TreeTab from '@/components/verrazzano/TreeTabbed/TreeTab';
import VerrazzanoHelper from '@/mixins/verrazzano/verrazzano-helper';
import VolumeDevices from '@/components/verrazzano/VolumeDevices';
import VolumeMounts from '@/components/verrazzano/VolumeMounts';

export default {
  name:       'ContainerTab',
  components: {
    Checkbox,
    ContainerLifecycleTab,
    ContainerPortsTab,
    ContainerProbe,
    ContainerResources,
    EnvironmentVariables,
    LabeledArrayList,
    LabeledInput,
    LabeledSelect,
    TabDeleteButton,
    TreeTab,
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
    tabName: {
      type:     String,
      required: true
    },
    tabLabel: {
      type:     String,
      required: true
    },
    typeLabel: {
      type:    String,
      default: ''
    }
  },
  computed: {
    terminationMessagePolicyOptions() {
      return [
        { value: 'File', label: this.t('verrazzano.common.types.terminationMessagePolicy.file') },
        { value: 'FallbackToLogsOnError', label: this.t('verrazzano.common.types.terminationMessagePolicy.fallbackToLogsOnError') },
      ];
    },
    containerTypeLabel() {
      return this.typeLabel ? this.typeLabel : this.t('verrazzano.common.tabs.container');
    }
  },
  methods: {
    deleteContainer() {
      this.$emit('delete', this.value);
    }
  },
};
</script>

<template>
  <TreeTab :name="tabName" :label="tabLabel" :title="containerTypeLabel">
    <template #beside-header>
      <TabDeleteButton
        :mode="mode"
        :element-name="containerTypeLabel"
        @click="deleteContainer()"
      />
    </template>
    <template #default>
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
    </template>
    <template #nestedTabs>
      <TreeTab :name="createTabName(tabName, 'execution')" :label="t('verrazzano.common.tabs.executionEnvironment')">
        <div class="row">
          <div class="col span-6">
            <LabeledArrayList
              :value="getField('command')"
              :mode="mode"
              :value-label="t('verrazzano.common.fields.container.command')"
              :add-label="t('verrazzano.common.buttons.addCommandArg')"
              @input="setFieldIfNotEmpty('command', $event)"
            />
          </div>
          <div class="col span-6">
            <LabeledArrayList
              :value="getField('args')"
              :mode="mode"
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
        <div class="spacer" />
        <div>
          <h3>{{ t('verrazzano.common.titles.envVars') }}</h3>
          <EnvironmentVariables
            :value="value"
            :mode="mode"
            :namespaced-object="namespacedObject"
            @input="$emit('input', $event)"
          />
        </div>
      </TreeTab>
      <ContainerPortsTab
        :value="value"
        :mode="mode"
        :tab-name="createTabName(tabName, 'ports')"
        @input="$emit('input', $event)"
      />
      <TreeTab :name="createTabName(tabName, 'resources')" :label="t('verrazzano.common.tabs.resources')">
        <ContainerResources
          :value="getField('resources')"
          :mode="mode"
          @input="setFieldIfNotEmpty('resources', $event)"
        />
      </TreeTab>
      <TreeTab :name="createTabName(tabName, 'livenessProbe')" :label="t('verrazzano.common.tabs.livenessProbe')">
        <ContainerProbe
          :value="getField('livenessProbe')"
          :mode="mode"
          @input="setFieldIfNotEmpty('livenessProbe', $event)"
        />
      </TreeTab>
      <TreeTab :name="createTabName(tabName, 'readinessProbe')" :label="t('verrazzano.common.tabs.readinessProbe')">
        <ContainerProbe
          :value="getField('readinessProbe')"
          :mode="mode"
          is-readiness-probe
          @input="setFieldIfNotEmpty('readinessProbe', $event)"
        />
      </TreeTab>
      <TreeTab :name="createTabName(tabName, 'startupProbe')" :label="t('verrazzano.common.tabs.startupProbe')">
        <ContainerProbe
          :value="getField('startupProbe')"
          :mode="mode"
          @input="setFieldIfNotEmpty('startupProbe', $event)"
        />
      </TreeTab>
      <ContainerLifecycleTab
        :value="getField('lifecycle')"
        :mode="mode"
        :tab-name="createTabName(tabName, 'lifecycle')"
        @input="setFieldIfNotEmpty('lifecycle', $event)"
      />
      <TreeTab :name="createTabName(tabName, 'volumeMounts')" :label="t('verrazzano.common.tabs.volumeMounts')">
        <VolumeMounts
          :value="value"
          :mode="mode"
          @input="$emit('input', $event)"
        />
      </TreeTab>
      <TreeTab :name="createTabName(tabName, 'volumeDevices')" :label="t('verrazzano.common.tabs.volumeDevices')">
        <VolumeDevices
          :value="value"
          :mode="mode"
          @input="$emit('input', $event)"
        />
      </TreeTab>
    </template>
  </TreeTab>
</template>

<style scoped>
  .spacer-tiny {
    padding: 5px 0 0 0;
  }
</style>
