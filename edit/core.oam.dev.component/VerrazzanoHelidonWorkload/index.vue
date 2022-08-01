<script>
// Added by Verrazzano
import { allHash } from '@/utils/promise';
import { SECRET, SERVICE_ACCOUNT } from '@/config/types';

import Tab from '@/components/Tabbed/Tab';
import Tabbed from '@/components/Tabbed';
import { _CREATE, _VIEW } from '@/config/query-params';

import { mapGetters } from 'vuex';
import { get, set } from '@/utils/object';
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
import Containers from '~/components/verrazzano/Containers';
import HelidonWorkloadHelper from '@/mixins/verrazzano/helidon-workload-helper';

const TAB_WEIGHT_MAP = {
  deployment: 99,
  pod:        98,
  containers: 97,
};

export default {
  name:       'CruVerrazzanoHelidonWorkload',
  components: {
    Tabbed, Tab, DeploymentStrategy, LabeledSelect, PodScheduler, UnitInput, Checkbox, Networking, LabeledInput, Loading, ServiceNameSelect, PodSecurity, PodSecurityContext, ReadinessGates, Tolerations, Volumes, KeyValue, Containers
  },

  mixins: [HelidonWorkloadHelper],

  props:    {
    mode: {
      type:    String,
      default: 'create'
    },
    value: {
      type:     Object,
      required: true
    },
  },

  data() {
    return { tabWeightMap: TAB_WEIGHT_MAP, allServiceAccounts: {} };
  },
  methods: {
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

  async fetch() {
    this.allServiceAccounts = {};

    const requests = { };

    if (this.$store.getters['cluster/schemaFor'](SERVICE_ACCOUNT)) {
      requests.serviceAccounts = this.$store.dispatch('cluster/findAll', { type: SERVICE_ACCOUNT });
    }

    const hash = await allHash(requests);

    if (hash.serviceAccounts) {
      this.sortObjectsByNamespace(hash.serviceAccounts, this.allServiceAccounts);
    }
    console.log(this.allServiceAccounts);
  },
  computed: {
    serviceAccounts() {
      const namespace = this.get(this.value, 'metadata.namespace');

      return this.allServiceAccounts[namespace] || [];
    },
  },
};
</script>

<template>
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
              :value="getWorkloadDeploymentTemplateMetadataField('labels')"
              :add-label="t('labels.addLabel')"
              :mode="mode"
              :read-allowed="false"
              :protip="false"
              @input="setWorkloadDeploymentTemplateMetadataField('labels',$event)"
            />
          </div>
          <div class="spacer"></div>
          <h3>{{ t('workload.container.titles.podAnnotations') }}</h3>
          <div class="row">
            <KeyValue
              key="annotations"
              :value="getWorkloadPodSpecMetadataField('annotations')"
              :add-label="t('labels.addAnnotation')"
              :mode="mode"
              :read-allowed="false"
              :protip="false"
              @input="setWorkloadPodSpecMetadataField('annotations', $event)"
            />
          </div>

          <div class="col span-6">
            <ServiceNameSelect
              :value="getWorkloadPodSpecField('serviceAccountName')"
              :mode="mode"
              :select-label="t('workload.serviceAccountName.label')"
              :select-placeholder="t('workload.serviceAccountName.label')"
              :options="serviceAccounts"
              option-label="metadata.name"
              :placeholder="getWorkloadPodSpecNotSetPlaceholder('serviceAccountName')"
              @input="setWorkloadPodSpecField('serviceAccountName',$event)"
            />
          </div>
          <div class="col span-6">
            <!--LabeledSelect
              v-model="imagePullSecrets"
              :label="t('workload.container.imagePullSecrets')"
              :multiple="true"
              :taggable="true"
              :options="namespacedSecrets"
              :mode="mode"
              option-label="metadata.name"
              :reduce="service=>service.metadata.name"
              :placeholder="getNotSetPlaceholder(value.container, 'imagePullSecrets')"
            /-->
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
              :value="getWorkloadPodSpecField('priority')"
              name="priority"
              :mode="mode"
              :placeholder="getWorkloadPodSpecNotSetPlaceholder('priority')"
              @input="setWorkloadPodSpecField('priority', $event)"
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
              :value="getWorkloadPodSpecField('preemptionPolicy')"
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
              :placeholder="getWorkloadPodSpecNotSetPlaceholder('preemptionPolicy')"
              @input="setWorkloadPodSpecField('preemptionPolicy', $event)"
            />
          </div>
          <div col-span="6">
            <h3>{{ t('verrazzano.VerrazzanoWebLogicWorkload.config.titles.serverPod.readinessGates') }}</h3>
            <ReadinessGates
              :value="getListField('spec.workload.spec.deploymentTemplate.podSpec.readinessGates')"
              :mode="mode"
              @input="setFieldIfNotEmpty('spec.workload.spec.deploymentTemplate.podSpec.readinessGates', $event)"
            />
          </div>
          <div class="col span-6">
            <UnitInput
              :value="getWorkloadPodSpecField('terminationGracePeriodSeconds')"
              :suffix="getWorkloadPodSpecField('terminationGracePeriodSeconds') == 1 ? 'Second' : 'Seconds'"

              :label="t('workload.upgrading.activeDeadlineSeconds.label')"
              :mode="mode"
              @input="setWorkloadPodSpecField('terminationGracePeriodSeconds', $event)"
            >
              <template #label>
                <label class="has-tooltip" :style="{'color':'var(--input-label)'}">
                  {{ t('workload.upgrading.terminationGracePeriodSeconds.label') }}
                  <i v-tooltip="t('workload.upgrading.terminationGracePeriodSeconds.tip')" class="icon icon-info" />
                </label>
              </template>
            </UnitInput>
          </div>
          <div class="col span-6">
            <h3>{{ t('verrazzano.VerrazzanoWebLogicWorkload.config.titles.serverPod.tolerations') }}</h3>
            <Tolerations v-model="workloadPodSpec" :mode="mode" />
          </div>

          <div class="spacer" />
          <div>
            <h3>{{ t('verrazzano.VerrazzanoWebLogicWorkload.config.titles.serverPod.volumes') }}</h3>
            <Volumes
              v-model="workloadPodSpec"
              :mode="mode"
              :namespaced-object="workloadPodSpec"
            />
          </div>
        </Tab>
        <Tab :label="t('workload.container.titles.networking')" name="networking">
          <Networking v-model="workloadPodSpec" :mode="mode" />
          <div class="col span-6">
            <h3>{{ t('verrazzano.VerrazzanoHelidonWorkload.config.titles.pod.setHostnameAsFQDN') }}</h3>
            <Checkbox
              :value="getWorkloadPodSpecField('setHostnameAsFQDN')"
              :mode="mode"
              :label="t('verrazzano.VerrazzanoHelidonWorkload.config.labels.pod.setHostnameAsFQDN')"
              @input="setWorkloadPodSpecField('setHostnameAsFQDN', $event)"
            />
          </div>
        </Tab>
        <Tab :label="t('verrazzano.VerrazzanoWebLogicWorkload.config.titles.serverPod.scheduling')" name="scheduling">
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
            <h3>{{ t('verrazzano.VerrazzanoWebLogicWorkload.config.titles.serverPod.podSecurityContext') }}</h3>
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
                  :value="getWorkloadPodSpecField('securityContext.fsGroup')"
                  type="number"
                  :mode="mode"
                  :label="t('workload.container.security.fsGroup')"
                  :placeholder="getWorkloadPodSpecNotSetPlaceholder('securityContext.fsGroup')"
                  @input="setWorkloadPodSpecField('securityContext.fsGroup',$event)"
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
        <h3>{{ t('verrazzano.common.titles.podSpec.containers') }}</h3>
        <Containers
          v-model="workloadPodSpec"
          :mode="mode"
          :namespaced-object="value"
        />
      </div>
      <div class="spacer" />
      <div>
        <h3>{{ t('verrazzano.common.titles.podSpec.initContainers') }}</h3>
        <Containers
          v-model="workloadPodSpec"
          :mode="mode"
          root-field-name="initContainers"
          :namespaced-object="value"
        />
      </div>
      <div class="spacer" />
      <div>
        <h3>{{ t('verrazzano.common.titles.podSpec.ephemeralContainers') }}</h3>
        <Containers
          v-model="workloadPodSpec"
          :mode="mode"
          root-field-name="ephemeralContainers"
          use-ephemeral-containers
          :namespaced-object="value"
        />
      </div>
    </Tab>
  </Tabbed>
</template>
