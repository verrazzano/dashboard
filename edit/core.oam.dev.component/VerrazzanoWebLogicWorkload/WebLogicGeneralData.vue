<script>
// Added by Verrazzano
import Checkbox from '@/components/form/Checkbox';
import LabeledInput from '@/components/form/LabeledInput';
import LabeledSelect from '@/components/form/LabeledSelect';
import WeblogicWorkloadHelper from '@/mixins/verrazzano/weblogic-workload-helper';
import { NAMESPACE, SECRET } from '@/config/types';
import { allHash } from '@/utils/promise';

export default {
  name:       'WebLogicGeneralData',
  components: {
    Checkbox,
    LabeledInput,
    LabeledSelect
  },
  mixins: [WeblogicWorkloadHelper],
  props:  {
    value: {
      // the root VerrazzanoWebLogicWorkload spec object.
      // We need the root object so that we can find/set the metadata.
      type:     Object,
      required: true
    },
    mode: {
      type:    String,
      default: 'create'
    }
  },
  data() {
    const imagePullSecrets = (this.getWorkloadSpecListField('imagePullSecrets') || []).map(each => each.name);

    return {
      fetchInProgress:    true,
      namespace:          this.value.metadata?.namespace,
      allNamespaces:      [],
      allSecrets:         {},
      secrets:            [],
      imagePullSecrets,
    };
  },
  async fetch() {
    this.allSecrets = {};

    const requests = { namespaces: this.$store.dispatch('cluster/findAll', { type: NAMESPACE }) };

    if (this.$store.getters['cluster/schemaFor'](SECRET)) {
      requests.secrets = this.$store.dispatch('cluster/findAll', { type: SECRET });
    }

    const hash = await allHash(requests);

    this.allNamespaces = hash.namespaces;

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
    setDomainUID(value) {
      this.setWorkloadMetadataField('labels."weblogic.domainUID"', value);
      this.setWorkloadSpecField('domainUID', value);
    },
    setImagePullSecrets(value) {
      this.setWorkloadSpecFieldIfNotEmpty('imagePullSecrets', value);
    }
  },
  watch: {
    fetchInProgress() {
      this.resetSecrets();
    },
    'value.metadata.namespace'(neu, old) {
      this.namespace = neu;
      this.resetSecrets();
    }
  },
};
</script>

<template>
  <div>
    <div class="row">
      <div class="col span-4">
        <LabeledInput
          :value="getWorkloadMetadataField('name')"
          :mode="mode"
          :label="t('verrazzano.VerrazzanoWebLogicWorkload.config.fields.name')"
          required
          @input="setWorkloadMetadataField('name', $event)"
        />
      </div>
      <div class="col span-4">
        <LabeledSelect
          :value="getWorkloadMetadataField('namespace')"
          :label="t('verrazzano.VerrazzanoWebLogicWorkload.config.fields.namespace')"
          :placeholder="getWorkloadMetadataNotSetPlaceholder('namespace')"
          :mode="mode"
          :options="allNamespaces"
          option-label="metadata.name"
          :reduce="namespace => namespace.metadata.name"
          @input="setWorkloadMetadataField('namespace', $event)"
        />
      </div>
      <div class="col span-4">
        <LabeledInput
          :value="getWorkloadSpecField('introspectVersion')"
          :mode="mode"
          :label="t('verrazzano.VerrazzanoWebLogicWorkload.config.fields.introspectVersion')"
          :placeholder="getWorkloadSpecNotSetPlaceholder('introspectVersion')"
          @input="setWorkloadSpecField('introspectVersion', $event)"
        />
      </div>
    </div>
    <div class="spacer" />
    <h3>{{ t('verrazzano.components.config.titles.image') }}</h3>
    <div class="row">
      <div class="col span-9">
        <LabeledInput
          :value="getWorkloadSpecField('image')"
          :mode="mode"
          :label="t('verrazzano.common.fields.image')"
          :placeholder="getWorkloadSpecNotSetPlaceholder('image')"
          required
          @input="setWorkloadSpecField('image', $event)"
        />
      </div>
      <div class="col span-3">
        <LabeledSelect
          :value="getWorkloadSpecField('imagePullPolicy')"
          :mode="mode"
          :placeholder="getWorkloadSpecNotSetPlaceholder('imagePullPolicy')"
          :label="t('verrazzano.common.fields.imagePullPolicy')"
          :options="imagePullPolicyOptions"
          option-key="value"
          @input="setWorkloadSpecField('imagePullPolicy', $event)"
        />
      </div>
    </div>
    <div class="spacer-small" />
    <div class="row">
      <div class="col span-6">
        <LabeledSelect
          :value="imagePullSecrets"
          :label="t('verrazzano.common.fields.imagePullSecrets')"
          :placeholder="getWorkloadSpecNotSetPlaceholder('imagePullSecrets')"
          :multiple="true"
          :taggable="true"
          :options="secrets"
          :mode="mode"
          option-label="metadata.name"
          :reduce="secret => secret.metadata.name"
          @input="setImagePullSecrets($event)"
        />
      </div>
    </div>
    <div class="spacer" />
    <h3>{{ t('verrazzano.VerrazzanoWebLogicWorkload.config.titles.domainSettings') }}</h3>
    <div class="row">
      <div class="col span-4">
        <LabeledInput
          :value="getWorkloadSpecListField('domainUID')"
          :mode="mode"
          :label="t('verrazzano.VerrazzanoWebLogicWorkload.config.fields.domainUID')"
          :placeholder="getWorkloadSpecNotSetPlaceholder('domainUID')"
          required
          @input="setDomainUID($event)"
        />
      </div>
      <div class="col span-4">
        <LabeledSelect
          :value="getWorkloadSpecListField('domainHomeSourceType')"
          :mode="mode"
          :label="t('verrazzano.VerrazzanoWebLogicWorkload.config.fields.domainHomeSourceType')"
          :placeholder="getWorkloadSpecNotSetPlaceholder('domainHomeSourceType')"
          :options="[
            {
              value: 'FromModel',
              label: t('verrazzano.VerrazzanoWebLogicWorkload.config.values.types.domainHomeSourceType.modelInImage')
            },
            {
              value: 'PersistentVolume',
              label: t('verrazzano.VerrazzanoWebLogicWorkload.config.values.types.domainHomeSourceType.domainInPV')
            },
          ]"
          option-key="value"
          required
          @input="setWorkloadSpecField('domainHomeSourceType', $event)"
        />
      </div>
      <div class="col span-4">
        <LabeledSelect
          :value="getWorkloadMetadataField('webLogicCredentialsSecret.name')"
          :label="t('verrazzano.VerrazzanoWebLogicWorkload.config.fields.webLogicCredentialsSecret')"
          :placeholder="getWorkloadSpecNotSetPlaceholder('webLogicCredentialsSecret.name')"
          :options="secrets"
          :mode="mode"
          option-label="metadata.name"
          :reduce="secret => secret.metadata.name"
          required
          @input="setWorkloadSpecField('webLogicCredentialsSecret.name', $event)"
        />
      </div>
    </div>
    <div class="spacer-small" />
    <div class="row">
      <div class="col span-6">
        <LabeledInput
          :value="getWorkloadSpecField('domainHome')"
          :label="t('verrazzano.VerrazzanoWebLogicWorkload.config.fields.domainHome')"
          :placeholder="getWorkloadSpecNotSetPlaceholder('domainHome')"
          :mode="mode"
          @input="setWorkloadSpecField('domainHome', $event)"
        />
      </div>
    </div>
    <div class="spacer" />
    <h3>{{ t('verrazzano.VerrazzanoWebLogicWorkload.config.titles.advanced') }}</h3>
    <div class="row">
      <div class="col span-6">
        <Checkbox
          :value="getWorkloadSpecField('logHomeEnabled')"
          :mode="mode"
          :label="t('verrazzano.VerrazzanoWebLogicWorkload.config.fields.logHomeEnabled')"
          @input="setWorkloadSpecField('logHomeEnabled', $event)"
        />
        <div class="spacer-tiny" />
        <Checkbox
          :value="getWorkloadSpecField('httpAccessLogInLogHome')"
          :mode="mode"
          :label="t('verrazzano.VerrazzanoWebLogicWorkload.config.fields.httpAccessLogInLogHome')"
          @input="setWorkloadSpecField('httpAccessLogInLogHome', $event)"
        />
        <div class="spacer-tiny" />
        <Checkbox
          :value="getWorkloadSpecField('includeServerOutInPodLog')"
          :mode="mode"
          :label="t('verrazzano.VerrazzanoWebLogicWorkload.config.fields.includeServerOutInPodLog')"
          @input="setWorkloadSpecField('includeServerOutInPodLog', $event)"
        />
      </div>
      <div class="col span-6">
        <LabeledInput
          v-if="getWorkloadSpecField('logHomeEnabled')"
          :value="getWorkloadSpecField('logHome')"
          :mode="mode"
          :label="t('verrazzano.VerrazzanoWebLogicWorkload.config.fields.logHome')"
          :placeholder="getWorkloadSpecNotSetPlaceholder('logHome')"
          @input="setWorkloadSpecField('logHome', $event)"
        />
        <div class="spacer-tiny" />
        <LabeledInput
          :value="getWorkloadSpecField('dataHome')"
          :mode="mode"
          :label="t('verrazzano.VerrazzanoWebLogicWorkload.config.fields.dataHome')"
          :placeholder="getWorkloadSpecNotSetPlaceholder('dataHome')"
          @input="setWorkloadSpecField('dataHome', $event)"
        />
      </div>
    </div>
    <div class="spacer" />
    <h4>{{ t('verrazzano.VerrazzanoWebLogicWorkload.config.titles.domainLifecycleSettings') }}</h4>
    <div class="row">
      <div class="col span-4">
        <LabeledInput
          :value="getWorkloadSpecField('replicas')"
          type="number"
          min="0"
          :mode="mode"
          :label="t('verrazzano.common.fields.replicas')"
          :placeholder="getWorkloadSpecNotSetPlaceholder('replicas')"
          @input="setWorkloadSpecNumberField('replicas', $event)"
        />
      </div>
      <div class="col span-2" />
      <div class="col span-6">
        <div class="spacer-small" />
        <Checkbox
          :value="getWorkloadSpecField('allowReplicasBelowMinDynClusterSize')"
          :mode="mode"
          :label="t('verrazzano.VerrazzanoWebLogicWorkload.config.fields.allowReplicasBelowMinDynClusterSize')"
          @input="setWorkloadSpecField('allowReplicasBelowMinDynClusterSize', $event)"
        />
      </div>
    </div>
    <div class="spacer-small" />
    <div class="row">
      <div class="col span-4">
        <LabeledInput
          :value="getWorkloadSpecField('restartVersion')"
          :mode="mode"
          :label="t('verrazzano.VerrazzanoWebLogicWorkload.config.fields.restartVersion')"
          :placeholder="getWorkloadSpecNotSetPlaceholder('restartVersion')"
          @input="setWorkloadSpecField('restartVersion', $event)"
        />
      </div>
      <div class="col span-4">
        <LabeledSelect
          :value="getWorkloadSpecField('serverStartPolicy')"
          :mode="mode"
          :label="t('verrazzano.VerrazzanoWebLogicWorkload.config.fields.serverStartPolicy')"
          :placeholder="getWorkloadSpecNotSetPlaceholder('serverStartPolicy')"
          :options="[
            {
              value: 'IF_NEEDED',
              label: t('verrazzano.VerrazzanoWebLogicWorkload.config.values.types.serverStartPolicy.ifNeeded')
            },
            {
              value: 'ADMIN_ONLY',
              label: t('verrazzano.VerrazzanoWebLogicWorkload.config.values.types.serverStartPolicy.adminOnly')
            },
            {
              value: 'NEVER',
              label: t('verrazzano.VerrazzanoWebLogicWorkload.config.values.types.serverStartPolicy.never')
            },
          ]"
          option-label="label"
          option-key="value"
          @input="setWorkloadSpecField('serverStartPolicy', $event)"
        />
      </div>
      <div class="col span-4">
        <LabeledSelect
          :value="getWorkloadSpecField('serverStartState')"
          :mode="mode"
          :label="t('verrazzano.VerrazzanoWebLogicWorkload.config.fields.serverStartState')"
          :placeholder="getWorkloadSpecNotSetPlaceholder('serverStartState')"
          :options="[
            {
              value: 'RUNNING',
              label: t('verrazzano.VerrazzanoWebLogicWorkload.config.values.types.serverStartState.running')
            },
            {
              value: 'ADMIN',
              label: t('verrazzano.VerrazzanoWebLogicWorkload.config.values.types.serverStartState.admin')
            },
          ]"
          option-label="label"
          option-key="value"
          @input="setWorkloadSpecField('serverStartState', $event)"
        />
      </div>
    </div>
    <div class="spacer-small" />
    <div class="row">
      <div class="col span-4">
        <LabeledInput
          :value="getWorkloadSpecField('maxClusterConcurrentStartup')"
          :mode="mode"
          type="number"
          min="0"
          :label="t('verrazzano.VerrazzanoWebLogicWorkload.config.fields.maxClusterConcurrentStartup')"
          :placeholder="getWorkloadSpecNotSetPlaceholder('maxClusterConcurrentStartup')"
          @input="setWorkloadSpecField('maxClusterConcurrentStartup', $event)"
        />
      </div>
      <div class="col span-4">
        <LabeledInput
          :value="getWorkloadSpecField('maxClusterConcurrentShutdown')"
          :mode="mode"
          type="number"
          min="0"
          :label="t('verrazzano.VerrazzanoWebLogicWorkload.config.fields.maxClusterConcurrentShutdown')"
          :placeholder="getWorkloadSpecNotSetPlaceholder('maxClusterConcurrentShutdown')"
          @input="setWorkloadSpecField('maxClusterConcurrentShutdown', $event)"
        />
      </div>
      <div class="col span-4">
        <LabeledInput
          :value="getWorkloadSpecField('livenessProbeCustomScript')"
          :mode="mode"
          :label="t('verrazzano.VerrazzanoWebLogicWorkload.config.fields.livenessProbeCustomScript')"
          :placeholder="getWorkloadSpecNotSetPlaceholder('livenessProbeCustomScript')"
          @input="setWorkloadSpecField('livenessProbeCustomScript', $event)"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
  @import "../verrazzano-styles.css";
</style>
