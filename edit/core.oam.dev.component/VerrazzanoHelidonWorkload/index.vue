<script>
// Added by Verrazzano
import { allHash } from '@/utils/promise';
import { SECRET, SERVICE_ACCOUNT } from '@/config/types';

import Tab from '@/components/Tabbed/Tab';
import Tabbed from '@/components/Tabbed';
import { _CREATE, _VIEW } from '@/config/query-params';

import { mapGetters } from 'vuex';
import { get, set } from '@/utils/object';
import Container from '@/components/verrazzano/container';
import DeploymentStrategy from '@/components/verrazzano/DeploymentStrategy.vue';
import NotSetPlaceholder from '@/mixins/verrazzano/not-set-placeholder';
import LabeledInput from '@/components/form/LabeledInput.vue';
import LabeledSelect from '@/components/form/LabeledSelect.vue';
import VerrazzanoHelper from '@/mixins/verrazzano/verrazzano-helper';
import UnitInput from '@/components/form/UnitInput.vue';
import PodScheduler from '@/components/verrazzano/PodScheduler.vue';
import Checkbox from '@/components/form/Checkbox.vue';
import Networking from '@/components/form/Networking.vue';
import Loading from '@/components/Loading';
import ServiceNameSelect from '@/components/form/ServiceNameSelect.vue';
import PodSecurity from '@/components/verrazzano/PodSecurity.vue';
import PodSecurityContext from '@/components/verrazzano/PodSecurityContext.vue';
import ReadinessGates from '@/components/verrazzano/ReadinessGates.vue';
import { BEFORE_SAVE_HOOKS } from '@/mixins/child-hook';
import KeyValue from '@/components/form/KeyValue';
import Tolerations from '~/components/verrazzano/Tolerations';
import Volumes from '~/components/verrazzano/Volumes';

const TAB_WEIGHT_MAP = {
  deployment: 99,
  pod:        98,
  containers: 97,
};

export default {
  name:       'CruVerrazzanoHelidonWorkload',
  components: {
    Tabbed, Tab, Container, DeploymentStrategy, LabeledSelect, PodScheduler, UnitInput, Checkbox, Networking, LabeledInput, Loading, ServiceNameSelect, PodSecurity, PodSecurityContext, ReadinessGates, Tolerations, Volumes, KeyValue
  },

  mixins: [VerrazzanoHelper, NotSetPlaceholder, BEFORE_SAVE_HOOKS],

  computed: {

    imagePullSecrets: {
      get() {
        let secrets = this.value?.spec?.workload?.spec?.deploymentTemplate?.podSpec?.imagePullSecrets;

        if (!secrets) {
          secrets = [];
        }

        return secrets.map(each => each.name);
      },
      set(neu) {
        if (!this.value.spec) {
          this.$set(this.value, 'spec', {});
        }
        if (!this.value.spec.workload) {
          this.$set(this.value.spec, 'workload', {});
        }
        if (!this.value.spec.workload) {
          this.$set(this.value.spec.workload, 'spec', {});
        }
        if (!this.value.spec.workload.spec.deploymentTemplate) {
          this.$set(this.value.spec.workload.spec, 'deploymentTemplate', {});
        }
        if (!this.value.spec.workload.spec.deploymentTemplate.podSpec) {
          this.$set(this.value.spec.workload.spec.deploymentTemplate, 'podSpec', {});
        }
        this.$set(this.value.spec.workload.spec.deploymentTemplate.podSpec, 'imagePullSecrets', neu.map((secret) => {
          return { name: secret };
        }));
      }
    },
    namespacedSecrets() {
      const namespace = this.value?.metadata?.namespace;

      if (namespace) {
        return this.allSecrets.filter(
          secret => secret.metadata.namespace === namespace
        );
      } else {
        return this.allSecrets;
      }
    },
    namespacedServiceNames() {
      const { namespace } = this.value?.metadata;

      if (namespace) {
        return this.sas.filter(
          serviceName => serviceName.metadata.namespace === namespace
        );
      } else {
        return this.sas;
      }
    },
    podLabels: {
      get() {
        if (!this.spec.workload.metadata) {
          this.$set(this.spec.workload, 'metadata', { labels: {} });
        }

        return this.spec.workload.metadata.labels;
      },
      set(neu) {
        this.$set(this.spec.workload.metadata, 'labels', neu);
      }
    },

    podAnnotations: {
      get() {
        if (!this.spec.workload.metadata) {
          this.$set( this.spec.workload, 'metadata', { annotations: {} });
        }

        return this.spec.workload.metadata.annotations;
      },
      set(neu) {
        this.$set( this.spec.workload.metadata, 'annotations', neu);
      }
    },
    ...mapGetters({ t: 'i18n/t' })
  },

  props: {
    mode: {
      type:    String,
      default: 'create'
    },
    value: {
      type:     Object,
      required: true
    },
  },
  async fetch() {
    const requests = { sas: this.$store.dispatch('cluster/findAll', { type: SERVICE_ACCOUNT }) };

    if (this.$store.getters['cluster/schemaFor'](SECRET)) {
      requests.secrets = this.$store.dispatch('cluster/findAll', { type: SECRET });
    }

    const hash = await allHash(requests);

    this.allSecrets = hash.secrets || [];
    this.sas = hash.sas;
  },
  data() {
    const spec = this.value.spec;
    const app = this.value;

    const version = app.metadata?.annotations?.version || null; // POC: not sure which version is applicable ?

    if (!spec?.workload?.spec?.deploymentTemplate) {
      set(spec, 'workload.spec.deploymentTemplate', {} );
    }
    const podTemplateSpec = this.value.spec?.workload?.spec?.deploymentTemplate?.podSpec;
    let containers = podTemplateSpec?.containers || [];

    const placement = spec?.placement?.clusters;

    let container;

    const createSidecar = !!this.$route.query.sidecar;

    if (this.mode === _CREATE || this.mode === _VIEW || (!createSidecar && !this.value.hasSidecars)) {
      container = containers[0];
    } else {
      if (!podTemplateSpec.initContainers) {
        podTemplateSpec.initContainers = [];
      }
      const allContainers = [...this.podTemplateSpec?.initContainers, ...this.podTemplateSpec?.containers];

      if (this.$route.query.init) {
        podTemplateSpec.initContainers.push({ imagePullPolicy: 'Always', name: `container-${ allContainers.length }` });
        containers = this.podTemplateSpec.initContainers;
      }
    }

    return {
      allClusterNames:   [],
      allComponentNames: [],
      allComponents:     [],
      allSecrets:        [],
      containers,
      imagePullPolicies: ['Always', 'IfNotPresent', 'Never'],
      placement,
      spec,
      version,
      tabWeightMap:      TAB_WEIGHT_MAP,
      container,
      podFsGroup:        this.podTemplateSpec?.securityContext?.fsGroup,
    };
  },
  methods: {
    get,
    set,
    initSpec() {
      this.$set(this.value, 'spec', {
        workload: {
          apiVersion: this.verrazzanoComponentApiVersion,
          kind:       'VerrazzanoHelidonWorkload',
          spec:       { deploymentTemplate: { podSpec: { } } }
        }
      });
    },
  },
  watch: {
    container(neu) {
      const existing = this.container;

      if (existing) {
        Object.assign(existing, neu);
      } else {
        this.container = neu;
      }
    }
  },

  created() {
    if (!this.value.spec?.workload?.spec?.deploymentTemplate) {
      this.initSpec();
    }

    this.podTemplateSpec = this.value.spec?.workload?.spec?.deploymentTemplate?.podSpec;
  },
};
</script>

<template>
  <Loading v-if="$fetchState.pending" />

  <form v-else>
    <Tabbed :side-tabs="false">
      <Tab
        :label="t('verrazzano.components.config.titles.deployment')"
        name="deployment"
        :weight="tabWeightMap['deployment']"
      >
        <DeploymentStrategy :value="value" :mode="mode" />
      </Tab>
      <Tab :label="t('verrazzano.components.config.titles.pod')" name="pod" :weight="tabWeightMap['pod']">
        <Tabbed :side-tabs="true">
          <Tab :label="t('workload.container.titles.general')" name="general" :weight="tabWeightMap['general']">
            <h3>{{ t('workload.container.titles.podLabels') }}</h3>
            <div class="row mb-20">
              <KeyValue
                key="labels"
                v-model="podLabels"
                :add-label="t('labels.addLabel')"
                :mode="mode"
                :read-allowed="false"
                :protip="false"
              />
            </div>
            <div class="spacer"></div>
            <h3>{{ t('workload.container.titles.podAnnotations') }}</h3>
            <div class="row">
              <KeyValue
                key="annotations"
                v-model="podAnnotations"
                :add-label="t('labels.addAnnotation')"
                :mode="mode"
                :read-allowed="false"
                :protip="false"
              />
            </div>

            <div class="col span-6">
              <ServiceNameSelect
                :value="getField('spec.workload.spec.deploymentTemplate.podSpec.serviceAccountName')"
                :mode="mode"
                :select-label="t('workload.serviceAccountName.label')"
                :select-placeholder="t('workload.serviceAccountName.label')"
                :options="namespacedServiceNames"
                option-label="metadata.name"
                :placeholder="getNotSetPlaceholder(value.podTemplateSpec, 'serviceAccountName')"
                @input="setFieldIfNotEmpty('spec.workload.spec.deploymentTemplate.podSpec.serviceAccountName',$event)"
              />
            </div>
            <div class="col span-6">
              <LabeledSelect
                v-model="imagePullSecrets"
                :label="t('workload.container.imagePullSecrets')"
                :multiple="true"
                :taggable="true"
                :options="namespacedSecrets"
                :mode="mode"
                option-label="metadata.name"
                :reduce="service=>service.metadata.name"
                :placeholder="getNotSetPlaceholder(value.container, 'imagePullSecrets')"
              />
            </div>
            <div class="col span-6">
              <UnitInput
                :value="getField('spec.workload.spec.deploymentTemplate.podSpec.activeDeadlineSeconds')"
                :mode="mode"
                :suffix="t('suffix.seconds', {count: getField('spec.workload.spec.deploymentTemplate.podSpec.activeDeadlineSeconds')})"
                label-key="workload.job.activeDeadlineSeconds.label"
                tooltip-key="workload.job.activeDeadlineSeconds.tip"
                @input="setFieldIfNotEmpty('spec.workload.spec.deploymentTemplate.podSpec.activeDeadlineSeconds', $event)"
              />
            </div>
            <div class="col span-6">
              <LabeledSelect
                :value="getField('spec.workload.spec.deploymentTemplate.podSpec.restartPolicy')"
                :mode="mode"
                :label="t('verrazzano.VerrazzanoWebLogicWorkload.config.fields.serverPod.restartPolicy')"
                :placeholder="getNotSetPlaceholder(value, 'restartPolicy')"
                :options="[
                  {
                    value: 'Always',
                    label: t('verrazzano.VerrazzanoWebLogicWorkload.config.values.types.restartPolicy.always')
                  },
                  {
                    value: 'OnFailure',
                    label: t('verrazzano.VerrazzanoWebLogicWorkload.config.values.types.restartPolicy.onFailure')
                  },
                  {
                    value: 'Never',
                    label: t('verrazzano.VerrazzanoWebLogicWorkload.config.values.types.restartPolicy.never')
                  },
                ]"
                option-key="value"
                option-label="label"
                @input="setField('spec.workload.spec.deploymentTemplate.podSpec.restartPolicy', $event)"
              />
            </div>
            <div class="col span-3">
              <h3>{{ t('verrazzano.VerrazzanoHelidonWorkload.config.titles.pod.priority') }}</h3>

              <LabeledInput
                v-model.number="podTemplateSpec.priority"
                name="priority"
                :mode="mode"
                :placeholder="getNotSetPlaceholder(value.container, 'priority')"
              />
            </div>
            <div class="col span-6">
              <LabeledInput
                :value="getField('spec.workload.spec.deploymentTemplate.podSpec.priorityClassName')"
                :mode="mode"
                :label="t('verrazzano.VerrazzanoWebLogicWorkload.config.fields.serverPod.priorityClassName')"
                :placeholder="getNotSetPlaceholder(value, 'priorityClassName')"
                @input="setField('spec.workload.spec.deploymentTemplate.podSpec.priorityClassName', $event)"
              />
            </div>
            <div class="col span-6">
              <LabeledInput
                :value="getField('spec.workload.spec.deploymentTemplate.podSpec.runtimeClassName')"
                :mode="mode"
                :label="t('verrazzano.VerrazzanoWebLogicWorkload.config.fields.serverPod.runtimeClassName')"
                :placeholder="getNotSetPlaceholder(value, 'runtimeClassName')"
                @input="setField('spec.workload.spec.deploymentTemplate.podSpec.runtimeClassName', $event)"
              />
            </div>
            <div class="col span-6">
              <h3>{{ t('verrazzano.VerrazzanoHelidonWorkload.config.titles.pod.automountServiceAccountToken') }}</h3>
              <Checkbox
                :value="getField('spec.workload.spec.deploymentTemplate.podSpec.automountServiceAccountToken')"
                :mode="mode"
                :label="t('verrazzano.VerrazzanoHelidonWorkload.config.labels.pod.automountServiceAccountToken')"
                @input="setBooleanField('spec.workload.spec.deploymentTemplate.podSpec.automountServiceAccountToken', $event)"
              />
            </div>
            <div class="col span-6">
              <h3>{{ t('verrazzano.VerrazzanoHelidonWorkload.config.titles.pod.enableServiceLinks') }}</h3>
              <Checkbox
                :value="getField('spec.workload.spec.deploymentTemplate.podSpec.enableServiceLinks')"
                :mode="mode"
                :label="t('verrazzano.VerrazzanoHelidonWorkload.config.labels.pod.enableServiceLinks')"
                @input="setBooleanField('spec.workload.spec.deploymentTemplate.podSpec.enableServiceLinks', $event)"
              />
            </div>
            <div class="col span-6">
              <h3>{{ t('verrazzano.VerrazzanoHelidonWorkload.config.titles.pod.preemptionPolicy') }}</h3>
              <LabeledSelect
                v-model="podTemplateSpec.preemptionPolicy"
                :label="t('verrazzano.VerrazzanoHelidonWorkload.config.labels.pod.preemptionPolicy')"
                :taggable="true"
                :options="[{
                             value: 'Always',
                             label: t('verrazzano.VerrazzanoHelidonWorkload.config.values.types.preemptionPolicy.never')
                           },
                           {
                             value: 'OnFailure',
                             label: t('verrazzano.VerrazzanoHelidonWorkload.config.values.types.preemptionPolicy.PreemptLowerPriority')
                           },
                ]"
                :mode="mode"
                :placeholder="getNotSetPlaceholder(value, 'preemptionPolicy')"
              />
            </div>
            <div col-span="6">
              <h3>{{ t('verrazzano.common.titles.readinessGates') }}</h3>
              <ReadinessGates
                :value="getListField('spec.workload.spec.deploymentTemplate.podSpec.readinessGates')"
                :mode="mode"
                @input="setFieldIfNotEmpty('spec.workload.spec.deploymentTemplate.podSpec.readinessGates', $event)"
              />
            </div>
            <div class="col span-6">
              <UnitInput v-model="podTemplateSpec.terminationGracePeriodSeconds" :suffix="podTemplateSpec.terminationGracePeriodSeconds == 1 ? 'Second' : 'Seconds'" :label="t('workload.upgrading.activeDeadlineSeconds.label')" :mode="mode">
                <template #label>
                  <label class="has-tooltip" :style="{'color':'var(--input-label)'}">
                    {{ t('workload.upgrading.terminationGracePeriodSeconds.label') }}
                    <i v-tooltip="t('workload.upgrading.terminationGracePeriodSeconds.tip')" class="icon icon-info" />
                  </label>
                </template>
              </UnitInput>
            </div>
            <div class="col span-6">
              <h3>{{ t('verrazzano.common.titles.tolerations') }}</h3>
              <Tolerations v-model="podTemplateSpec" :mode="mode" />
            </div>

            <div class="spacer" />
            <div>
              <h3>{{ t('verrazzano.common.titles.volumes') }}</h3>
              <Volumes
                v-model="podTemplateSpec"
                :mode="mode"
                :namespaced-object="podTemplateSpec"
              />
            </div>
          </Tab>
          <Tab :label="t('workload.container.titles.networking')" name="networking">
            <Networking v-model="podTemplateSpec" :mode="mode" />
            <div class="col span-6">
              <h3>{{ t('verrazzano.VerrazzanoHelidonWorkload.config.titles.pod.setHostnameAsFQDN') }}</h3>
              <Checkbox
                :value="getField('spec.workload.spec.deploymentTemplate.podSpec.setHostnameAsFQDN')"
                :mode="mode"
                :label="t('verrazzano.VerrazzanoHelidonWorkload.config.labels.pod.setHostnameAsFQDN')"
                @input="setBooleanField('spec.workload.spec.deploymentTemplate.podSpec.setHostnameAsFQDN', $event)"
              />
            </div>
          </Tab>
          <Tab :label="t('verrazzano.common.titles.scheduling')" name="scheduling">
            <PodScheduler
              v-model="value"
              :mode="mode"
            />
          </Tab>
          <Tab :label="t('workload.container.titles.securityContext')" name="securityContext">
            <div class="spacer">
              <PodSecurity :value="getField('spec.workload.spec.deploymentTemplate.podSpec')" :mode="mode" />
            </div>
            <div>
              <h3>{{ t('verrazzano.common.titles.podSecurityContext') }}</h3>
              <PodSecurityContext
                :value="getField('spec.workload.spec.deploymentTemplate.podSpec.securityContext')"
                :mode="mode"
                @input="setFieldIfNotEmpty('spec.workload.spec.deploymentTemplate.podSpec.securityContext', $event)"
              />
            </div>
            <div class="spacer" />
            <div class="spacer"></div>
            <div>
              <h3>{{ t('workload.container.security.podFsGroup') }}</h3>
              <div class="row">
                <div class="col span-6">
                  <LabeledInput
                    :value="getField('spec.workload.spec.deploymentTemplate.podSpec.securityContext.fsGroup')"
                    type="number"
                    :mode="mode"
                    :label="t('workload.container.security.fsGroup')"
                    :placeholder="getNotSetPlaceholder(this, 'podFsGroup')"
                    @input="setNumberField('spec.workload.spec.deploymentTemplate.podSpec.securityContext.fsGroup',$event)"
                  />
                </div>
              </div>
            </div>
          </Tab>
        </Tabbed>
      </Tab>
      <Tab
        :label="t('verrazzano.components.config.titles.containers')"
        name="containers"
        :weight="tabWeightMap['containers']"
      >
        <div>
          <div :style="{'align-items':'center'}" class="row mb-20">
            <Container :value="value" :mode="mode" />
          </div>
        </div>
      </Tab>
    </Tabbed>
  </form>
</template>
