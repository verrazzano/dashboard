<script>
// Added by Verrazzano
import Checkbox from '@/components/form/Checkbox';
import ContainerResources from '@/components/verrazzano/ContainerResources';
import EnvironmentVariables from '@/components/verrazzano/EnvironmentVariables';
import LabeledInput from '@/components/form/LabeledInput';
import LabeledSelect from '@/components/form/LabeledSelect';
import VolumeMounts from '@/components/verrazzano/VolumeMounts';
import WeblogicWorkloadHelper from '@/mixins/verrazzano/weblogic-workload-helper';

import { SECRET } from '@/config/types';
import { allHash } from '@/utils/promise';

export default {
  name:       'FluentdSpecification',
  components: {
    Checkbox,
    ContainerResources,
    EnvironmentVariables,
    LabeledInput,
    LabeledSelect,
    VolumeMounts,
  },
  mixins: [WeblogicWorkloadHelper],
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
  data() {
    return {
      fetchInProgress: true,
      namespace:       this.namespacedObject.metadata?.namespace,
      allSecrets:      {},
      secrets:         []
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
    }
  },
  watch: {
    fetchInProgress() {
      this.resetSecrets();
    },
    'namespacedObject.metadata.namespace'(neu, old) {
      this.namespace = neu;
      this.resetSecrets();
    }
  },
};
</script>

<template>
  <div>
    <div class="row">
      <div class="col span-6">
        <LabeledInput
          :value="getField('image')"
          :mode="mode"
          :label="t('verrazzano.VerrazzanoWebLogicWorkload.config.fields.fluentd.image')"
          @input="setFieldIfNotEmpty('image', $event)"
        />
      </div>
      <div class="col span-3">
        <LabeledSelect
          :value="getField('imagePullPolicy')"
          :mode="mode"
          :options="imagePullPolicyOptions"
          option-key="value"
          option-label="label"
          :label="t('verrazzano.VerrazzanoWebLogicWorkload.config.fields.fluentd.imagePullPolicy')"
          @input="setField('imagePullPolicy', $event)"
        />
      </div>
      <div class="col span-3">
        <LabeledSelect
          :value="getField('elasticSearchCredentials')"
          :mode="mode"
          required
          :options="secrets"
          option-label="metadata.name"
          :reduce="secret => secret.metadata.name"
          :label="t('verrazzano.VerrazzanoWebLogicWorkload.config.fields.fluentd.elasticSearchCredentials')"
          @input="setField('elasticSearchCredentials', $event)"
        />
      </div>
    </div>
    <div class="spacer-small" />
    <div class="row">
      <div class="col span-6">
        <LabeledInput
          :value="getField('fluentdConfiguration')"
          :mode="mode"
          type="multiline"
          :label="t('verrazzano.VerrazzanoWebLogicWorkload.config.fields.fluentd.fluentdConfiguration')"
          @input="setFieldIfNotEmpty('fluentdConfiguration', $event)"
        />
      </div>
      <div class="col span-1" />
      <div class="col span-3">
        <div class="spacer-small" />
        <Checkbox
          :value="getField('watchIntrospectorLogs')"
          :mode="mode"
          :label="t('verrazzano.VerrazzanoWebLogicWorkload.config.fields.fluentd.watchIntrospectorLogs')"
          @input="setBooleanField('watchIntrospectorLogs', $event)"
        />
      </div>
    </div>
    <div class="spacer-small" />
    <div>
      <h3>{{ t('verrazzano.VerrazzanoWebLogicWorkload.config.titles.envVars') }}</h3>
      <EnvironmentVariables
        v-model="value"
        :mode="mode"
        :enable-env-from-options="false"
        :namespaced-object="namespacedObject"
      />
    </div>
    <div class="spacer-small" />
    <div>
      <h3>{{ t('verrazzano.VerrazzanoWebLogicWorkload.config.titles.volumeMounts') }}</h3>
      <VolumeMounts
        v-model="value"
        :mode="mode"
      />
    </div>
    <div class="spacer-small" />
    <div>
      <h3>{{ t('verrazzano.VerrazzanoWebLogicWorkload.config.titles.resources') }}</h3>
      <ContainerResources
        :value="getField('resources')"
        :mode="mode"
        @input="setFieldIfNotEmpty('resources', $event)"
      />
    </div>
  </div>
</template>

<style scoped>

</style>
