<script>
// Added by Verrazzano
import ConfigurationModel from '@/edit/core.oam.dev.component/VerrazzanoWebLogicWorkload/ConfigurationModel';
import LabeledInput from '@/components/form/LabeledInput';
import LabeledSelect from '@/components/form/LabeledSelect';
import OpssConfiguration from '@/edit/core.oam.dev.component/VerrazzanoWebLogicWorkload/OpssConfiguration';
import WeblogicWorkloadHelper from '@/mixins/verrazzano/weblogic-workload-helper';

import { CONFIG_MAP, SECRET } from '@/config/types';
import { allHash } from '@/utils/promise';

export default {
  name:       'ConfigurationData',
  components: {
    ConfigurationModel,
    LabeledInput,
    LabeledSelect,
    OpssConfiguration,
  },
  mixins: [WeblogicWorkloadHelper],
  props:  {
    value: {
      // the configuration folder
      type:     Object,
      default: () => ({})
    },
    mode: {
      type:    String,
      default: 'create'
    },
    isModelInImage: {
      type:    Boolean,
      default: true
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
      allConfigMaps:   {},
      secrets:         [],
      configMaps:      []
    };
  },
  async fetch() {
    this.allSecrets = {};

    const requests = { secrets: this.$store.dispatch('cluster/findAll', { type: SECRET }) };

    if (this.$store.getters['cluster/schemaFor'](CONFIG_MAP)) {
      requests.configMaps = this.$store.dispatch('cluster/findAll', { type: CONFIG_MAP });
    }

    const hash = await allHash(requests);

    if (hash.secrets) {
      this.sortObjectsByNamespace(hash.secrets, this.allSecrets);
    }
    if (hash.configMaps) {
      this.sortObjectsByNamespace(hash.configMaps, this.allConfigMaps);
    }
    this.fetchInProgress = false;
  },
  computed: {
    overrideDistributionStrategyOptions() {
      return [
        { value: 'DYNAMIC', label: this.t('verrazzano.weblogic.types.overrideDistributionStrategy.dynamic') },
        { value: 'ON_RESTART', label: this.t('verrazzano.weblogic.types.overrideDistributionStrategy.onRestart') },
      ];
    }
  },
  methods: {
    resetSecretsAndConfigMaps() {
      if (!this.fetchInProgress) {
        this.secrets = this.allSecrets[this.namespace] || [];
        this.configMaps = this.allConfigMaps[this.namespace] || [];
      }
    }
  },
  watch: {
    fetchInProgress() {
      this.resetSecretsAndConfigMaps();
    },
    'namespacedObject.metadata.namespace'(neu, old) {
      this.namespace = neu;
      this.resetSecretsAndConfigMaps();
    },
  },
};
</script>

<template>
  <div>
    <div class="row">
      <div class="col span-4">
        <LabeledInput
          :value="getField('introspectorJobActiveDeadlineSeconds')"
          :mode="mode"
          type="number"
          min="0"
          :label="t('verrazzano.weblogic.fields.introspectorJobActiveDeadlineSeconds')"
          :placeholder="getNotSetPlaceholder(value, 'introspectorJobActiveDeadlineSeconds')"
          @input="setField('introspectorJobActiveDeadlineSeconds', $event)"
        />
      </div>
      <div class="col span-4">
        <LabeledSelect
          :value="getField('overrideDistributionStrategy')"
          :mode="mode"
          :options="overrideDistributionStrategyOptions"
          option-key="value"
          option-label="label"
          :placeholder="getNotSetPlaceholder(value, 'overrideDistributionStrategy')"
          :label="t('verrazzano.weblogic.fields.overrideDistributionStrategy')"
          @input="setFieldIfNotEmpty('overrideDistributionStrategy', $event)"
        />
      </div>
      <div class="col span-4">
        <LabeledInput
          :value="getField('overridesConfigMap')"
          :mode="mode"
          :placeholder="getNotSetPlaceholder(value, 'overridesConfigMap')"
          :label="t('verrazzano.weblogic.fields.overridesConfigMap')"
          @input="setFieldIfNotEmpty('overridesConfigMap', $event)"
        />
      </div>
    </div>
    <div class="spacer-small" />
    <div class="row">
      <LabeledSelect
        :value="getListField('secrets')"
        :mode="mode"
        :multiple="true"
        :taggable="true"
        :options="secrets"
        option-label="metadata.name"
        :reduce="secret => secret.metadata.name"
        :placeholder="getNotSetPlaceholder(value, 'secrets')"
        :label="t('verrazzano.common.fields.secrets')"
        @input="setFieldIfNotEmpty('secrets', $event)"
      />
    </div>
    <div v-if="isModelInImage" class="spacer">
      <h3>{{ t('verrazzano.weblogic.titles.modelConfiguration') }}</h3>
      <ConfigurationModel
        :value="getField('model')"
        :mode="mode"
        :namespaced-object="namespacedObject"
        @input="setFieldIfNotEmpty('model', $event)"
      />
    </div>
    <div class="spacer">
      <h3>{{ t('verrazzano.weblogic.titles.opss') }}</h3>
      <OpssConfiguration
        :value="getField('opss')"
        :mode="mode"
        :namespaced-object="namespacedObject"
        @input="setFieldIfNotEmpty('opss', $event)"
      />
    </div>
  </div>
</template>

<style scoped>
  @import "../verrazzano-styles.css";
</style>
