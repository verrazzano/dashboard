<script>
// Added by Verrazzano
import Vue from 'vue';
import { MANAGEMENT, SECRET } from '@/config/types';
import ArrayListGrouped from '@/components/form/ArrayListGrouped';
import LabeledInput from '@/components/form/LabeledInput';
import LabeledSelect from '@/components/form/LabeledSelect';
import { _CREATE, _VIEW } from '@/config/query-params';
import { allHash } from '@/utils/promise';
import ArrayList from '@/components/form/ArrayList';
import { mapGetters } from 'vuex';

const KIND_VALUES = {
  LoggingTrait:      'LoggingTrait',
  IngressTrait:      'IngressTrait',
  MetricsTrait:       'MetricsTrait',
  ManualScalerTrait: 'ManualScalerTrait',
};

export default {
  created() {
    this.KIND_VALUES = KIND_VALUES;
    this.kindToAdd = null;
  },

  components: {
    ArrayListGrouped,
    LabeledInput,
    LabeledSelect,
    ArrayList,
  },

  props: {
    value: {
      type:    Array,
      default: null
    },
    mode: {
      type:    String,
      default: _CREATE,
    }
  },

  async fetch() {
    const requests = {
      clusters: this.$store.dispatch('management/findAll', {
        type: MANAGEMENT.CLUSTER,
        opt:  { url: MANAGEMENT.CLUSTER }
      }),
    };

    if ( this.$store.getters['cluster/schemaFor'](SECRET) ) {
      requests.secrets = this.$store.dispatch('cluster/findAll', { type: SECRET });
    }

    const hash = await allHash(requests);

    this.allSecrets = [];
    if (hash.secrets) {
      this.allSecrets = hash.secrets.map(secret => secret.id);
    }
  },

  data() {
    return {
      allSecrets: [],
      kindToAdd:  this.kindToAdd
    };
  },

  computed: {
    kindOptions() {
      // limit the kind of traits by filtering existing traits for this component
      const allKinds = Object.values(KIND_VALUES).map((v) => {
        return ({ label: this.$store.getters['i18n/withFallback'](`verrazzano.types."${ v }"`), value: v });
      });

      const availableKinds = allKinds.filter((k) => {
        return !this.value.find(t => t.trait.kind === k.value);
      });

      return availableKinds;
    },

    localValue: {
      get() {
        return this.value;
      },

      set(localValue) {
        this.$emit('input', localValue);
      }
    },

    defaultAddData() {
      return { kind: KIND_VALUES.NONE };
    },

    pathTypeChoices() {
      return [
        { label: 'Prefix', value: 'prefix' },
        { label: 'Exact', value: 'exact' },
        { label: 'Regex', value: 'regex' },
      ];
    },

    addTraitStyle() {
      return this.mode === _VIEW ? { display: 'none' } : {};
    },

    ...mapGetters({ t: 'i18n/t' }),
  },

  methods: {
    getSafe: (fn) => {
      try {
        return fn();
      } catch (e) {}
    },
    setSpecProperty: (trait, property, value) => {
      if (property === 'kind') {
        Vue.set(trait, property, value);
        switch (value) {
        case KIND_VALUES.ManualScalerTrait:
          Vue.set(trait, 'apiVersion', 'core.oam.dev/v1alpha2');
          break;
        case KIND_VALUES.MetricsTrait:
        case KIND_VALUES.LoggingTrait:
        case KIND_VALUES.IngressTrait:
          Vue.set(trait, 'apiVersion', 'oam.verrazzano.io/v1alpha1');
          break;
        default:
          if (trait.apiVersion) {
            Vue.delete(trait.apiVersion);
          }
        }

        if (trait.spec) {
          Vue.delete(trait.spec);
        }
      } else {
        if (!trait.spec) {
          Vue.set(trait, 'spec', {});
        }
        Vue.set(trait.spec, property, value);
      }
    },
    addCollectionToSpec: (trait, property, collection) => {
      if (!trait.spec) {
        Vue.set(trait, 'spec', {});
      }

      Vue.set(trait.spec, property, collection);
    },
    addTrait(list) {
      list.push({ trait: { kind: this.kindToAdd } });
      this.kindToAdd = null;
    },
    styleForProperty(property) {
      if (this.mode === _VIEW && !property) {
        return { display: 'none' };
      }
    },

  }

};

</script>

<template>
  <div class="bordered-section">
    <ArrayListGrouped
      v-model="localValue"
      table-class="fixed"
      :mode="mode"
      :title="t('tableHeaders.traits')"
      :can-add="false"
    >
      <template #default="{row}">
        <LabeledSelect
          :value="row.value.trait.kind"
          :disabled="true"
          mode="view"
          :options="kindOptions"
          :label="t('verrazzano.apps.traits.labels.kind')"
          @input="setSpecProperty(row.value.trait, 'kind', $event)"
        />

        <div v-if="row.value.trait.kind === KIND_VALUES.ManualScalerTrait">
          <!-- replicaCount -->
          <LabeledInput
            ref="replicaCount"
            :value="getSafe(()=>row.value.trait.spec.replicaCount)"
            :label="t('verrazzano.apps.traits.labels.replicaCount')"
            :mode="mode"
            type="number"
            :required="true"
            min="0"
            max="65535"
            :placeholder="t('verrazzano.apps.traits.placeholders.replicaCount')"
            @input="setSpecProperty(row.value.trait, 'replicaCount', parseInt($event))"
          />
        </div>
        <div v-else-if="row.value.trait.kind === KIND_VALUES.IngressTrait" class="mt-20">
          <!-- rules, tls -->
          <ArrayListGrouped
            :value="getSafe(() => row.value.trait.spec.rules)"
            :title="t('verrazzano.apps.traits.titles.rules')"
            :default-add-value="{}"
            :mode="mode"
            :add-label="t('verrazzano.apps.traits.addlabels.rules')"
            @input="addCollectionToSpec(row.value.trait, 'rules', $event)"
          >
            <template #default="rule">
              <div :style="styleForProperty(rule.row.value.hosts)">
                <ArrayList
                  key="hosts"
                  v-model="rule.row.value.hosts"
                  :title="t('verrazzano.apps.traits.titles.hosts')"
                  :value-placeholder="t('verrazzano.apps.traits.placeholders.hosts')"
                  :add-label="t('verrazzano.apps.traits.addlabels.hosts')"
                  :mode="mode"
                  :protip="false"
                />
              </div>
              <div :style="styleForProperty(rule.row.value.paths)">
                <ArrayListGrouped
                  v-model="rule.row.value.paths"
                  :title="t('verrazzano.apps.traits.titles.paths')"
                  :mode="mode"
                  :add-label="t('verrazzano.apps.traits.addlabels.paths')"
                  :default-add-value="{}"
                >
                  <template #default="path">
                    <div :style="styleForProperty(path.row.value.path)">
                      <LabeledInput
                        v-model="path.row.value.path"
                        :label="t('verrazzano.apps.traits.labels.paths')"
                        :mode="mode"
                        :placeholder="t('verrazzano.apps.traits.placeholders.ingresspath')"
                      />
                    </div>
                    <div :style="styleForProperty(path.row.value.pathType)">
                      <LabeledSelect
                        v-model="path.row.value.pathType"
                        :mode="mode"
                        :options="pathTypeChoices"
                        :label="t('verrazzano.apps.traits.labels.pathtype')"
                      />
                    </div>
                  </template>
                </ArrayListGrouped>
              </div>
              <h3 v-t="'verrazzano.apps.traits.titles.destination'" :style="styleForProperty(rule.row.value.host)||styleForProperty(rule.row.value.port)" />
              <div :style="styleForProperty(rule.row.value.host)">
                <LabeledInput
                  v-model="rule.row.value.host"
                  :label="t('verrazzano.apps.traits.labels.host')"
                  :mode="mode"
                  :placeholder="t('verrazzano.apps.traits.placeholders.host')"
                />
              </div>
              <div :style="styleForProperty(rule.row.value.port)">
                <LabeledInput
                  v-model="rule.row.value.port"
                  :label="t('verrazzano.apps.traits.labels.port')"
                  :mode="mode"
                  type="number"
                  min="0"
                  max="65535"
                  :placeholder="t('verrazzano.apps.traits.placeholders.port')"
                />
              </div>
            </template>
          </ArrayListGrouped>

          <div :style="styleForProperty(getSafe(() => row.value.trait.spec.tls.secretName))">
            <h3 v-t="'verrazzano.apps.traits.titles.security'" />

            <LabeledSelect
              :value="getSafe(() => row.value.trait.spec.tls.secretName)"
              :mode="mode"
              :label="t('verrazzano.apps.traits.labels.secret')"
              :options="allSecrets"
              :multiple="true"
            />
          </div>
        </div>
        <div v-else-if="row.value.trait.kind === KIND_VALUES.MetricsTrait">
          <!-- port, path, secret, scraper -->
          <div :style="styleForProperty(getSafe(() => row.value.trait.spec.port))">
            <LabeledInput
              :value="getSafe(() => row.value.trait.spec.port)"
              :label="t('verrazzano.apps.traits.placeholders.port')"
              :mode="mode"
              type="number"
              min="0"
              max="65535"
              :placeholder="t('verrazzano.apps.traits.placeholders.port')"
            />
          </div>
          <div :style="styleForProperty(getSafe(()=>row.value.trait.spec.path))">
            <LabeledInput
              ref="path"
              :value="getSafe(()=>row.value.trait.spec.path)"
              :label="t('verrazzano.apps.traits.labels.path')"
              :mode="mode"
              :placeholder="t('verrazzano.apps.traits.placeholders.path')"
              @input="setSpecProperty(row.value.trait, 'path', $event)"
            />
          </div>
          <div :style="styleForProperty(getSafe(()=>row.value.trait.spec.secret))">
            <LabeledInput
              ref="secret"
              :value="getSafe(()=>row.value.trait.spec.secret)"
              :label="t('verrazzano.apps.traits.labels.secret')"
              :mode="mode"
              :placeholder="t('verrazzano.apps.traits.placeholders.secret')"
              @input="setSpecProperty(row.value.trait, 'secret', $event)"
            />
          </div>
          <div :style="styleForProperty(getSafe(()=>row.value.trait.spec.scraper))">
            <LabeledInput
              ref="scraper"
              :value="getSafe(()=>row.value.trait.spec.scraper)"
              :label="t('verrazzano.apps.traits.labels.scraper')"
              :mode="mode"
              :placeholder="t('verrazzano.apps.traits.placeholders.scraper')"
              @input="setSpecProperty(row.value.trait, 'scraper', $event)"
            />
          </div>
        </div>
        <div v-else-if="row.value.trait.kind === KIND_VALUES.LoggingTrait">
          <!-- port, path, secret, scraper -->
          <div :style="styleForProperty(getSafe(() => row.value.trait.spec.loggingConfig))">
            <LabeledInput
              :value="getSafe(() => row.value.trait.spec.loggingConfig)"
              :label="t('verrazzano.apps.traits.labels.loggingconfig')"
              :mode="mode"
              :placeholder="t('verrazzano.apps.traits.placeholders.loggingconfig')"
              type="multiline"
              @input="setSpecProperty(row.value.trait, 'loggingConfig', $event)"
            />
          </div>
          <div :style="getSafe(()=>row.value.trait.spec.loggingImage)">
            <LabeledInput
              :value="getSafe(()=>row.value.trait.spec.loggingImage)"
              :label="t('verrazzano.apps.traits.labels.loggingimage')"
              :mode="mode"
              placeholder="e.g. fluent/fleuntd-example-image"
              @input="setSpecProperty(row.value.trait, 'loggingImage', $event)"
            />
          </div>
        </div>
      </template>
    </ArrayListGrouped>
    <div :style="addTraitStyle">
      <h3 v-t="'verrazzano.apps.traits.titles.newtrait'" />
      <LabeledSelect
        v-model="kindToAdd"
        :options="kindOptions"
        :label="t('verrazzano.apps.traits.labels.kind')"
      />
      <button
        type="button"
        class="btn role-tertiary add"
        :disabled="kindToAdd === null"
        @click="addTrait(localValue)"
        v-html="t('verrazzano.apps.traits.addlabels.traits')"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .compact-select {
    height: 40px;
  }
</style>
