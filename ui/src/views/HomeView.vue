<script setup lang="ts">
import Button from '@/components/buttons/Button.vue';
import PlayCircleIcon from '@/components/icons/PlayCircleIcon.vue';
import GcoinIcon from '@/components/icons/GcoinIcon.vue';
import gsap from 'gsap';
import ScrollTrigger from "gsap/ScrollTrigger";
import { ref, onMounted } from 'vue';
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Navigation, Pagination } from 'swiper/modules';
import { daoAddresses } from '@/scripts/data';
import { getDAOs as getDAOsImpl } from '@/scripts/greenback-contracts';
import ChevronRight from '@/components/icons/ChevronRight.vue';
import type { DAO } from '@/types';
import { toCurrency, fromAptosUnits } from '@/scripts/utils';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

gsap.registerPlugin(ScrollTrigger);
const modules = [Navigation, Pagination];

const daos = ref<DAO[]>([]);

const getDAOs = async () => {
  daos.value = await getDAOsImpl(daoAddresses);
};

onMounted(() => {
  getDAOs();

  const sections = gsap.utils.toArray(".step");

  gsap.to(sections, {
    xPercent: -100 * (sections.length - 1),
    ease: 'power1',
    scrollTrigger: {
      trigger: ".steps",
      pin: true,
      scrub: 1,
      snap: 1 / (sections.length - 1),
      end: () => "+=" + document.querySelector<HTMLElement>(".steps")?.offsetWidth
    }
  });
});
</script>

<template>
  <div id="smooth_wrapper">
    <div id="smooth_content">
      <section>
        <div class="app_width">
          <div class="home">
            <div class="hero">
              <div class="hero_text">
                <span>Join the war against un-recycled plastics!</span>
                <h3>The world’s destination for sustainability.</h3>
                <p>Seamlessly integrating rewards with environmental action and charitable
                  giving.</p>

                <RouterLink to="/app">
                  <div class="button">
                    <Button :text="'Get Started'" />
                  </div>
                </RouterLink>
              </div>
            </div>

            <div class="machine">
              <div class="machine_image">
                <img src="/images/vending_machine.jpg" alt="">
                <PlayCircleIcon />
              </div>
              <div class="machine_name">
                <p>The Recycling Machine</p>
                <div class="liner"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div class="step_section">
        <div class="section_head">
          <div class="section_head_title">
            <h3>It's just a four simple steps...</h3>
            <p>...to get started.</p>
          </div>
        </div>

        <section class="step-container">
          <div class="app_width">
            <div class="steps">
              <div class="step">
                <div class="step_image">
                  <img
                    src="https://img.freepik.com/free-photo/3d-render-secure-login-password-illustration_107791-16640.jpg?t=st=1722614582~exp=1722618182~hmac=c9239b7fe514456555939e4231c97011a62e471506f40dcd8159f54154264383&w=826"
                    alt="">
                </div>
                <div class="step_text">
                  <h3>Sign in with Google</h3>
                  <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Explicabo dolorem iusto repellat?</p>
                </div>
              </div>

              <div class="step">
                <div class="step_image">
                  <img
                    src="https://img.freepik.com/premium-photo/white-glass-pendant-with-silver-ring-it_1216342-837.jpg?w=1380"
                    alt="">
                </div>
                <div class="step_text">
                  <h3>Request for your GCard</h3>
                  <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Explicabo dolorem iusto repellat?</p>
                </div>
              </div>

              <div class="step">
                <div class="step_image">
                  <img
                    src="https://img.freepik.com/free-psd/recycling-icon-design_23-2151600840.jpg?t=st=1722614554~exp=1722618154~hmac=6d8f5063dabf1fc8212fee2b84280787da963936006f368aca2ebe9020dfc490&w=826"
                    alt="">
                </div>
                <div class="step_text">
                  <h3>Start recycling your used bottlles</h3>
                  <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Explicabo dolorem iusto repellat?</p>
                </div>
              </div>

              <div class="step">
                <div class="step_image">
                  <img
                    src="https://img.freepik.com/free-photo/businessman-holding-heap-banknote-cash-payment-money-transfer-exchange-concept-by-3d-render-illustration_616485-108.jpg?t=st=1722614647~exp=1722618247~hmac=6c530b105379d42d79df91895dbcc02ef527dbb549bc76fef16b989fa7610f59&w=1380"
                    alt="">
                </div>
                <div class="step_text">
                  <h3>Accumulate $GCoin</h3>
                  <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Explicabo dolorem iusto repellat?</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <section class="public_good_section">
        <div class="app_width">
          <div class="public_good">
            <div class="section_head">
              <div class="section_head_title">
                <h3>GreenBack for Public Good as DAOs.</h3>
                <p>...the gateway to decentralized donation.</p>
              </div>
            </div>

            <Swiper :modules="modules" :slides-per-view="4.2" :space-between="30" navigation :centeredSlides="true"
              :pagination="{ clickable: true, dynamicBullets: true, }">
              <div class="slide_gradient">
                <div></div>
                <div></div>
              </div>
              <SwiperSlide v-for="dao, index in daos" :key="index">
                <RouterLink :to="`/app/donate/${dao.daoAddress}`">
                  <div class="dao">
                    <div class="dao_name">
                      <p>{{ dao.name }}</p>
                    </div>

                    <div class="dao_detail">
                      <div class="proposals">
                        <p>Proposals</p>
                        <div class="proposals_info">
                          <p v-if="dao.nextProposalId == 0">No proposal</p>
                          <div class="images">
                            <img v-if="dao.nextProposalId > 0" src="/images/logo.png" alt="">
                            <img v-if="dao.nextProposalId > 1" src="/images/logo.png" alt="">
                            <img v-if="dao.nextProposalId > 2" src="/images/logo.png" alt="">
                          </div>
                          <p>{{ dao.nextProposalId > 3 ? `+ ${dao.nextProposalId - 3}` : '' }}</p>
                        </div>
                      </div>

                      <Button :text="'View all'">
                        <ChevronRight />
                      </Button>
                    </div>

                    <div class="dao_raised_amount">
                      <p>Raised amount</p>
                      <div class="dao_raised_amount_info">
                        <GcoinIcon />
                        <p> {{ toCurrency(fromAptosUnits(dao.raisedAmount)) }}</p>
                      </div>
                    </div>
                  </div>
                </RouterLink>
              </SwiperSlide>
            </Swiper>

            <div class="public_good_button">
              <RouterLink to="/app/donate">
                <Button :text="'Donate your $GCoin'" />
              </RouterLink>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
.home {
  padding-top: 80px;
}

.hero {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.hero_text {
  text-align: center;
  width: 1000px;
  max-width: 100%;
}

.hero span {
  padding: 12px 20px;
  background: var(--primary-light);
  border-radius: 20px;
  color: var(--tx-normal);
  font-size: 14px;
  font-weight: 500;
}

.hero_text h3 {
  font-size: 54px;
  line-height: 75px;
  font-weight: 600;
  color: var(--tx-normal);
  margin-top: 40px;
}

.hero_text p {
  margin-top: 30px;
  color: var(--tx-semi);
  font-size: 18px;
  font-weight: 400;
}

.hero_text .button {
  display: flex;
  justify-content: center;
  margin-top: 40px;
}

.machine {
  margin-top: 80px;
  display: flex;
  align-items: center;
  flex-direction: column;
}

.machine_image {
  width: 1200px;
  height: 600px;
  max-width: 100%;
  border-radius: 16px;
  overflow: hidden;
  position: relative;
}

.machine_image img {
  width: 100%;
  height: 100%;
}

.machine_image svg {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  z-index: 1;
  cursor: pointer;
}

.machine_name {
  width: 1200px;
  max-width: 100%;
  position: relative;
  display: flex;
  align-items: center;
  margin-top: 20px;
}

.machine_name>p {
  color: var(--tx-normal);
  font-size: 24px;
  font-weight: 500;
  z-index: 1;
  background: var(--bg);
  padding-right: 30px;
}

.machine_name .liner {
  width: 100%;
  height: 2px;
  background: var(--bg-darkest);
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  border-radius: 2px;
  cursor: pointer;
}

.step_section {
  margin-top: 180px;
}

.section_head {
  display: flex;
  align-items: center;
  flex-direction: column;
}

.section_head_title {
  text-align: center;
}

.section_head_title h3 {
  font-size: 54px;
  line-height: 75px;
  font-weight: 600;
  color: var(--tx-normal);
}

.section_head_title p {
  margin-top: 20px;
  color: var(--tx-semi);
  font-size: 34px;
  font-weight: 400;
  margin-bottom: 80px;
}

.step-container {
  background: var(--bg-dark);
  overflow: hidden;
}

.step-container .app_width {
  width: 600px;
  height: 100%;
}

.steps {
  display: grid;
  grid-template-columns: repeat(4, 600px);
  align-items: center;
  height: min(100vh, 950px);
}

.step {
  width: 600px;
  height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 30px;
  border-image-source: linear-gradient(to bottom, transparent, var(--bg-darkest), transparent);
  border-right: 1px solid;
  border-image-slice: 1;
}

.step:last-child {
  border-right: none;
}

.step_text {
  max-width: 100%;
  padding: 0 50px;
  text-align: center;
}

.step_text h3 {
  font-size: 20px;
  font-weight: 500;
  color: var(--tx-normal);
}

.step_text p {
  margin-top: 10px;
  color: var(--tx-dimmed);
  font-size: 16px;
  font-weight: 400;
}

.step_image {
  max-width: 100%;
  height: 340px;
  width: 220px;
  border-radius: 6px;
  overflow: hidden;
  position: relative;
}

.step_image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.public_good_section {
  display: flex;
  align-items: center;
  padding: 160px 0;
}

.public_good_section .app_width {
  width: 1440px;
}

.slide_gradient {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  z-index: 1;
}

.slide_gradient>div {
  height: 100%;
  width: min(30%, 300px);
}

.slide_gradient>div:first-child {
  background: linear-gradient(to right, var(--bg), transparent);
}

.slide_gradient>div:last-child {
  background: linear-gradient(to left, var(--bg), transparent);
}

.campaign_info {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 16px;
  padding-top: 0;
}

.campaign_info_members {
  display: flex;
  align-items: center;
  gap: 10px;
}

.campaign_info_members .images {
  display: flex;
  align-items: center;
}

.campaign_info_members img {
  width: 30px;
  height: 30px;
  border-radius: 20px;
  object-fit: cover;
  margin-left: -10px;
}

.campaign_info_members img:first-child {
  margin: 0;
}

.campaign_info_price {
  color: var(--primary);
  font-size: 16px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
}

.campaign_info_price svg {
  width: 18px;
  height: 18px;
  margin-bottom: 4px;
}

.campaign_info_members p {
  color: var(--tx-semi);
  font-size: 12px;
  font-weight: 400;
}

.public_good_button {
  display: flex;
  justify-content: center;
  margin-top: 60px;
}


.dao {
  border: 1px solid var(--bg-darkest);
  padding: 16px;
  border-radius: 10px;
}

.dao_name {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}

.dao_name>p {
  font-size: 16px;
  font-weight: 500;
  color: var(--tx-normal);
}

.dao_detail {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid var(--bg-darker);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.proposals>p {
  font-size: 14px;
  font-weight: 500;
  color: var(--tx-semi);
}

.proposals_info {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-top: 2px;
}

.proposals_info>p {
  font-size: 14px;
  font-weight: 500;
  color: var(--tx-dimmed);
}

.proposals .images {
  display: flex;
  align-items: center;
}

.proposals img {
  width: 20px;
  height: 20px;
  object-fit: cover;
  border-radius: 12px;
  margin-left: -10px;
}

.proposals img:first-child {
  margin: 0;
}

.dao_raised_amount {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid var(--bg-darker);
}

.dao_raised_amount>p {
  font-size: 14px;
  font-weight: 500;
  color: var(--tx-semi);
}

.dao_raised_amount svg {
  width: 16px;
  height: 16px;
}

.dao_raised_amount_info {
  display: flex;
  align-items: center;
  gap: 4px;
}

.dao_raised_amount_info p {
  font-size: 16px;
  font-weight: 500;
  color: var(--tx-semi);
  margin-top: 4px;
}
</style>
