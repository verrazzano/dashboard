<script>
// Added by Verrazzano
import Checkbox from '@/components/form/Checkbox';
import CoherenceWorkloadHelper from '@/mixins/verrazzano/coherence-workload-helper';
import JVMDebugSpec from '@/edit/core.oam.dev.component/VerrazzanoCoherenceWorkload/JVMDebugSpec';
import JVMGarbageCollectorSpec from '@/edit/core.oam.dev.component/VerrazzanoCoherenceWorkload/JVMGarbageCollectorSpec';
import JVMMemorySpec from '@/edit/core.oam.dev.component/VerrazzanoCoherenceWorkload/JVMMemorySpec';
import LabeledArrayList from '@/components/verrazzano/LabeledArrayList';
import LabeledInput from '@/components/form/LabeledInput';
import Volume from '@/components/verrazzano/Volumes/Volume';

export default {
  name:       'JVMSpec',
  components: {
    Checkbox,
    JVMDebugSpec,
    JVMGarbageCollectorSpec,
    JVMMemorySpec,
    LabeledArrayList,
    LabeledInput,
    Volume,
  },
  mixins: [CoherenceWorkloadHelper],
  props:  {
    value: {
      type:    Object,
      default: () => ({})
    },
    mode: {
      type:    String,
      default: 'create'
    },
    namespacedObject: {
      type:     Object,
      required: true
    }
  },
  computed: {
    jmxmpEnabled() {
      const result = this.getField('jmxmp.enabled');

      return result ? Boolean(result) : false;
    }
  }
};
</script>

<template>
  <div>
    <div class="row">
      <div class="col span-4">
        <div class="spacer-tiny" />
        <Checkbox
          :value="getField('useContainerLimits')"
          :mode="mode"
          :label="t('verrazzano.coherence.fields.useContainerLimits')"
          @input="setBooleanField('useContainerLimits', $event)"
        />
        <div class="spacer-tiny" />
        <Checkbox
          :value="getField('useJibClasspath')"
          :mode="mode"
          :label="t('verrazzano.coherence.fields.useJibClasspath')"
          @input="setBooleanField('useJibClasspath', $event)"
        />
      </div>
      <div class="col span-4">
        <LabeledArrayList
          :value="getListField('classpath')"
          :mode="mode"
          :value-label="t('verrazzano.coherence.fields.classpathEntry')"
          :add-label="t('verrazzano.coherence.buttons.addClasspathEntry')"
          @input="setFieldIfNotEmpty('classpath', $event)"
        />
      </div>
      <div class="col span-4">
        <LabeledArrayList
          :value="getListField('args')"
          :mode="mode"
          :value-label="t('verrazzano.coherence.fields.jvmArg')"
          :add-label="t('verrazzano.coherence.buttons.addJVMArg')"
          @input="setFieldIfNotEmpty('args', $event)"
        />
      </div>
    </div>
    <div class="spacer-small" />
    <div class="row">
      <div class="col span-4">
        <Checkbox
          :value="getField('jmxmp.enabled')"
          :mode="mode"
          :label="t('verrazzano.coherence.fields.jmxmp.enabled')"
          @input="setBooleanField('jmxmp.enabled', $event)"
        />
      </div>
      <div v-if="jmxmpEnabled" class="col span-4">
        <LabeledInput
          :value="getField('jmxmp.port')"
          :mode="mode"
          type="Number"
          :min="minPortNumber"
          :max="maxPortNumber"
          :placeholder="getNotSetPlaceholder(value, 'jmxmp.port')"
          :label="t('verrazzano.coherence.fields.jmxmp.port')"
          @input="setNumberField('jmxmp.port', $event)"
        />
      </div>
    </div>
    <div class="spacer" />
    <div>
      <h3>{{ t('verrazzano.coherence.titles.debugSettings') }}</h3>
      <JVMDebugSpec
        :value="getField('debug')"
        :mode="mode"
        @input="setFieldIfNotEmpty('debug', $event)"
      />
    </div>
    <div class="spacer" />
    <div>
      <h3>{{ t('verrazzano.coherence.titles.gcSettings') }}</h3>
      <JVMGarbageCollectorSpec
        :value="getField('gc')"
        :mode="mode"
        @input="setFieldIfNotEmpty('gc', $event)"
      />
    </div>
    <div class="spacer" />
    <div>
      <h3>{{ t('verrazzano.coherence.titles.memorySettings') }}</h3>
      <JVMMemorySpec
        :value="getField('memory')"
        :mode="mode"
        @input="setFieldIfNotEmpty('memory', $event)"
      />
    </div>
    <div class="spacer" />
    <div>
      <h3>{{ t('verrazzano.coherence.titles.diagnosticsVolume') }}</h3>
      <Volume
        :value="getField('diagnosticsVolume')"
        :mode="mode"
        :namespaced-object="namespacedObject"
        @input="setFieldIfNotEmpty('diagnosticsVolume', $event)"
      />
    </div>
  </div>
</template>

<style scoped>
  @import "../verrazzano-styles.css";
</style>
