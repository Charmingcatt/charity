<template>
  <div class="introduce-wrapper">
    <div class="introduce-info">
      <h4>网站概况</h4>
      <el-divider />
      <div class="bottom">
        <span><i class=el-icon-date></i>2022-05-10</span>
        <span>地址：四川省成都市</span>
        <span>发布人：爱心公益网</span>
      </div>
      <el-image :src="global+'upload/'+'466cbdc3-37d4-4eb3-bc24-789bda607b2d.jpg'"></el-image>
      <div class="content">
        <div>
          &nbsp;&nbsp;&nbsp;&nbsp;爱心公益网站成立于2022年，是新中国首家以“爱心”“公益”命名，经中国政府批准依法注册登记，由热心慈善事业的公民、法人及其他社会组织志愿参加的全国性非营利公益社会团体。其宗旨为“发扬人道主义精神，
          弘扬中华民族传统美德，为发展慈善事业，传播慈善文化，帮助困难群众和个人，开展多种形式的慈善活动”。 </div>
        <div>
          &nbsp;&nbsp;&nbsp;&nbsp;爱心公益网站成立至今，广泛动员社会各界爱心力量，多方筹措慈善款物，实施慈善项目，开展慈善活动，在紧急救援、扶贫济困、安老助孤、医疗救助、助学支教等多个领域成效卓著，业已形成一个遍布全国、规模庞大的慈善援助网络。截至2021年底，共募集慈善款物价值达1400多亿元，使数以千万计困难群众得到不同形式的救助，成为推动国家慈善事业发展的一支重要力量。近年来，爱心公益网站重点推出全国性慈善项目“幸福家园”村社互助工程和
          “善济病困”工程，为助力乡村振兴、参与社会治理、推进共同富裕作出了积极贡献。</div>
        <div>&nbsp;&nbsp;&nbsp;&nbsp;爱心公益网站始终坚持严格的业务管理与信息公开制度，社会公信力持久稳步提升，连
          续被民政部评为“全国先进社会组织”，自2008年起连续三次获评全国“AAAAA级基金会”称号。
          爱心公益网站始终坚持“广结善缘、奉献社会、服务行业”的立会原则，
          截至2021年底，已拥有全国各地460余个会员单位及个人会员，成为中国慈善事业名副其实的枢纽型慈善组织。</div>
        <div>&nbsp;&nbsp;&nbsp;&nbsp;爱心公益网站不断加强对外联络工作，与港澳台和海外众多公益慈善机构建立良好的合作关系，共同实施了多项合作项目，得到国际社会的广泛认同，业
          已成为联系海内外华人和国际友人，共同促进中国慈善事业稳步健康发展的一个枢纽型慈善组织。</div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'introduce',
    data() {
      return {
        global: this.global.base
      }
    }
  }
</script>

<style scoped lang="less">
  .introduce-wrapper {
    margin: 1rem 4rem;
    min-height: 20rem;
    display: flex;

    .not-found {
      text-align: center;
      margin: 0 auto;
    }

    .introduce-info {
      margin: 0 auto;
      width: 60%;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;

      .content {
        width: 100%;
        text-align: left;
        display: flex;
        flex-direction: column;
        //justify-content: center;
        // align-items: center;

        div {
          margin: 8px 0;
          width: 100%;
        }
      }

      /deep/.el-image__inner {
        width: 46rem;
        height: 20rem;
      }

      .bottom {
        span {
          display: inline-block;
          margin: 0 1rem 1rem 1rem;
        }

        color: gray !important;
        font-size: 0.9rem;
      }
    }
  }
</style>