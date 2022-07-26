<script>
// Added by Verrazzano
import ContainerizedWorkloadHelper from '@/mixins/verrazzano/containerized-workload-helper';
import LabeledArrayList from '@/components/verrazzano/LabeledArrayList';
import LabeledInput from '@/components/form/LabeledInput';
import LabeledSelect from '@/components/form/LabeledSelect';
import OAMConfigFiles from '@/edit/core.oam.dev.component/ContainerizedWorkload/OAMContainers/OAMConfigFiles';
import OAMEnvironmentVariables
  from '@/edit/core.oam.dev.component/ContainerizedWorkload/OAMContainers/OAMEnvironmentVariables';
import OAMHealthProbe from '@/edit/core.oam.dev.component/ContainerizedWorkload/OAMContainers/OAMHealthProbe';
import OAMPorts from '@/edit/core.oam.dev.component/ContainerizedWorkload/OAMContainers/OAMPorts';
import OAMResources from '@/edit/core.oam.dev.component/ContainerizedWorkload/OAMContainers/OAMResources';

import { SECRET } from '@/config/types';
import { allHash } from '@/utils/promise';

export default {
  name:       'OAMContainer',
  components: {
    LabeledArrayList,
    LabeledInput,
    LabeledSelect,
    OAMConfigFiles,
    OAMEnvironmentVariables,
    OAMHealthProbe,
    OAMPorts,
    OAMResources,
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
    namespacedObject: {
      type:     Object,
      required: true
    },
  },
  data() {
    return {
      fetchInProgress: true,
      namespace:       this.namespacedObject.metadata?.namespace,
      allSecrets:      {},
      secrets:         [],
    };
  },
  async fetch() {
    const requests = { secrets: this.$store.dispatch('cluster/findAll', { type: SECRET }) };

    const hash = await allHash(requests);

    if (hash.secrets) {
      this.sortObjectsByNamespace(hash.secrets, this.allSecrets);
    }
    this.fetchInProgress = false;
  },
  methods: {
    resetSecrets() {
      if (!this.fetchInProgress) {
        this.secrets = this.allSecrets[this.namespace] || [];
      }
    },
  },
  watch: {
    fetchInProgress() {
      this.resetSecrets();
    },
    'namespacedObject.metadata.namespace'(neu, old) {
      this.namespace = neu;
      this.resetSecrets();
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
          :placeholder="getNotSetPlaceholder(value, 'name')"
          :label="t('verrazzano.common.fields.container.name')"
          @input="setFieldIfNotEmpty('name', $event)"
        />
      </div>
      <div class="col span-6">
        <LabeledInput
          :value="getField('image')"
          :mode="mode"
          required
          :placeholder="getNotSetPlaceholder(value, 'image')"
          :label="t('verrazzano.common.fields.container.image')"
          @input="setFieldIfNotEmpty('image', $event)"
        />
      </div>
      <div class="col span-3">
        <LabeledSelect
          :value="getField('imagePullSecret')"
          :mode="mode"
          :options="secrets"
          option-label="metadata.name"
          :reduce="secret => secret.metadata.name"
          :placeholder="getNotSetPlaceholder(value, 'imagePullSecret')"
          :label="t('verrazzano.common.fields.container.imagePullSecret')"
          @input="setFieldIfNotEmpty('imagePullSecret', $event)"
        />
      </div>
    </div>
    <div class="spacer" />
    <div>
      <h3>{{ t('verrazzano.common.titles.container.resources') }}</h3>
      <OAMResources
        :value="getField('resources')"
        :mode="mode"
        @input="setFieldIfNotEmpty('resources', $event)"
      />
    </div>
    <div class="spacer" />
    <div class="row">
      <div class="col span-6">
        <h3>{{ t('verrazzano.common.titles.container.cmd') }}</h3>
        <LabeledArrayList
          :value="getListField('cmd')"
          :mode="mode"
          :value-label="t('verrazzano.common.fields.container.command')"
          :add-label="t('verrazzano.common.buttons.addCommandArg')"
          @input="setFieldIfNotEmpty('cmd', $event)"
        />
      </div>
      <div class="col span-6">
        <h3>{{ t('verrazzano.common.titles.container.args') }}</h3>
        <LabeledArrayList
          :value="getListField('args')"
          :mode="mode"
          :value-label="t('verrazzano.common.fields.container.argument')"
          :add-label="t('verrazzano.common.buttons.addArgument')"
          @input="setFieldIfNotEmpty('args', $event)"
        />
      </div>
    </div>
    <div class="spacer" />
    <div>
      <h3>{{ t('verrazzano.common.titles.envVars') }}</h3>
      <OAMEnvironmentVariables v-model="value" :mode="mode" />
    </div>
    <div class="spacer" />
    <div>
      <h3>{{ t('verrazzano.common.titles.configFiles') }}</h3>
      <OAMConfigFiles v-model="value" :mode="mode" />
    </div>
    <div class="spacer" />
    <div>
      <h3>{{ t('verrazzano.common.titles.ports') }}</h3>
      <OAMPorts v-model="value" :mode="mode" />
    </div>
    <div class="spacer" />
    <div>
      <h3>{{ t('verrazzano.common.titles.livenessProbe') }}</h3>
      <OAMHealthProbe
        :value="getField('livenessProbe')"
        :mode="mode"
        @input="setFieldIfNotEmpty('livenessProbe', $event)"
      />
    </div>
    <div class="spacer" />
    <div>
      <h3>{{ t('verrazzano.common.titles.readinessProbe') }}</h3>
      <OAMHealthProbe
        :value="getField('readinessProbe')"
        :mode="mode"
        @input="setFieldIfNotEmpty('readinessProbe', $event)"
      />
    </div>
  </div>
</template>

<style scoped>

</style>
