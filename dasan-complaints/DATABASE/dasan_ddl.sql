/* =========================================================
   1. 실시간 시간 단위 원본 테이블
   ========================================================= */
CREATE TABLE tb_real_time (
    real_time_seq BIGINT(20) NOT NULL COMMENT '실시간 수신 데이터 고유 식별자',
    yy VARCHAR(4) DEFAULT NULL COMMENT '수신 연도 (YYYY)',
    mm VARCHAR(2) DEFAULT NULL COMMENT '수신 월 (MM)',
    dd VARCHAR(2) DEFAULT NULL COMMENT '수신 일 (DD)',
    hh VARCHAR(2) DEFAULT NULL COMMENT '수신 시각 (HH)',
    keyword VARCHAR(50) DEFAULT NULL COMMENT '민원/상담 키워드',
    call_id VARCHAR(50) DEFAULT NULL COMMENT '콜 또는 민원 식별자',
    PRIMARY KEY (real_time_seq)
) COMMENT='실시간 수신 원본 데이터 테이블';

/* 실시간 집계용 인덱스 */
CREATE INDEX idx_rt_time ON tb_real_time (yy, mm, dd, hh);


/* =========================================================
   2. 실시간 요일 단위 집계 테이블
   ========================================================= */
CREATE TABLE tb_real_mon (
    real_mon_seq BIGINT(20) NOT NULL COMMENT '월요일 집계 데이터 식별자',
    keyword VARCHAR(50) NOT NULL DEFAULT '' COMMENT '집계 대상 키워드',
    count INT(11) DEFAULT NULL COMMENT '월요일 키워드 발생 건수',
    PRIMARY KEY (real_mon_seq)
) COMMENT='실시간 월요일 키워드 집계 테이블';

CREATE TABLE tb_real_tue (
    real_tue_seq BIGINT(20) NOT NULL COMMENT '화요일 집계 데이터 식별자',
    keyword VARCHAR(50) NOT NULL DEFAULT '' COMMENT '집계 대상 키워드',
    count INT(11) DEFAULT NULL COMMENT '화요일 키워드 발생 건수',
    PRIMARY KEY (real_tue_seq)
) COMMENT='실시간 화요일 키워드 집계 테이블';

CREATE TABLE tb_real_wed (
    real_wed_seq BIGINT(20) NOT NULL COMMENT '수요일 집계 데이터 식별자',
    keyword VARCHAR(50) NOT NULL DEFAULT '' COMMENT '집계 대상 키워드',
    count INT(11) DEFAULT NULL COMMENT '수요일 키워드 발생 건수',
    PRIMARY KEY (real_wed_seq)
) COMMENT='실시간 수요일 키워드 집계 테이블';

CREATE TABLE tb_real_thu (
    real_thu_seq BIGINT(20) NOT NULL COMMENT '목요일 집계 데이터 식별자',
    keyword VARCHAR(50) NOT NULL DEFAULT '' COMMENT '집계 대상 키워드',
    count INT(11) DEFAULT NULL COMMENT '목요일 키워드 발생 건수',
    PRIMARY KEY (real_thu_seq)
) COMMENT='실시간 목요일 키워드 집계 테이블';

CREATE TABLE tb_real_fri (
    real_fri_seq BIGINT(20) NOT NULL COMMENT '금요일 집계 데이터 식별자',
    keyword VARCHAR(50) NOT NULL DEFAULT '' COMMENT '집계 대상 키워드',
    count INT(11) DEFAULT NULL COMMENT '금요일 키워드 발생 건수',
    PRIMARY KEY (real_fri_seq)
) COMMENT='실시간 금요일 키워드 집계 테이블';

CREATE TABLE tb_real_sat (
    real_sat_seq BIGINT(20) NOT NULL COMMENT '토요일 집계 데이터 식별자',
    keyword VARCHAR(50) NOT NULL DEFAULT '' COMMENT '집계 대상 키워드',
    count INT(11) DEFAULT NULL COMMENT '토요일 키워드 발생 건수',
    PRIMARY KEY (real_sat_seq)
) COMMENT='실시간 토요일 키워드 집계 테이블';

CREATE TABLE tb_real_sun (
    real_sun_seq BIGINT(20) NOT NULL COMMENT '일요일 집계 데이터 식별자',
    keyword VARCHAR(50) NOT NULL DEFAULT '' COMMENT '집계 대상 키워드',
    count INT(11) DEFAULT NULL COMMENT '일요일 키워드 발생 건수',
    PRIMARY KEY (real_sun_seq)
) COMMENT='실시간 일요일 키워드 집계 테이블';

/* 요일 테이블 공통 인덱스 */
CREATE INDEX idx_real_mon_keyword ON tb_real_mon (keyword);
CREATE INDEX idx_real_tue_keyword ON tb_real_tue (keyword);
CREATE INDEX idx_real_wed_keyword ON tb_real_wed (keyword);
CREATE INDEX idx_real_thu_keyword ON tb_real_thu (keyword);
CREATE INDEX idx_real_fri_keyword ON tb_real_fri (keyword);
CREATE INDEX idx_real_sat_keyword ON tb_real_sat (keyword);
CREATE INDEX idx_real_sun_keyword ON tb_real_sun (keyword);

/* =========================================================
   3. 상담사 상담 키워드 전체 원본 테이블 (배치)
   ========================================================= */
CREATE TABLE tb_bach_consultation (
    bach_consultation_seq BIGINT(20) NOT NULL COMMENT '배치 상담 데이터 고유 식별자',
    yy VARCHAR(4) DEFAULT NULL COMMENT '상담 발생 연도',
    mm VARCHAR(2) DEFAULT NULL COMMENT '상담 발생 월',
    dd VARCHAR(2) DEFAULT NULL COMMENT '상담 발생 일',
    hh VARCHAR(2) DEFAULT NULL COMMENT '상담 발생 시각',
    wk VARCHAR(1) DEFAULT NULL COMMENT '요일',
    gu VARCHAR(50) DEFAULT NULL COMMENT '구',
    dong VARCHAR(50) DEFAULT NULL COMMENT '동',
    keyword VARCHAR(50) DEFAULT NULL COMMENT '상담 키워드',
    call_id VARCHAR(50) DEFAULT NULL COMMENT '상담 식별자',
    PRIMARY KEY (bach_consultation_seq)
) COMMENT='상담사 상담 키워드 배치 원본 테이블';

/* 배치 집계 최적화 인덱스 */
CREATE INDEX idx_bc_date ON tb_bach_consultation (yy, mm, dd);
CREATE INDEX idx_bc_region ON tb_bach_consultation (gu, dong);


/* =========================================================
   4. 상담사 상담 키워드 월 집계 테이블 (1월 예시)
   ========================================================= */
CREATE TABLE tb_bach_1m (
    bach_1m_seq BIGINT(20) NOT NULL COMMENT '1월 집계 데이터 식별자',
    yy VARCHAR(4) NOT NULL DEFAULT '' COMMENT '집계 기준 연도',
    mm VARCHAR(2) NOT NULL DEFAULT '' COMMENT '집계 기준 월',
    dd VARCHAR(2) NOT NULL DEFAULT '' COMMENT '집계 기준 일',
    hh VARCHAR(2) NOT NULL DEFAULT '' COMMENT '집계 기준 시각',
    wk VARCHAR(1) DEFAULT NULL COMMENT '요일 코드',
    gu VARCHAR(50) NOT NULL DEFAULT '' COMMENT '서울시 자치구 명',
    dong VARCHAR(50) NOT NULL DEFAULT '' COMMENT '자치구 하위 동 명',
    keyword VARCHAR(50) NOT NULL DEFAULT '' COMMENT '집계 대상 키워드',
    count INT(11) DEFAULT 0 COMMENT '키워드 누적 발생 건수',
    PRIMARY KEY (bach_1m_seq)
) COMMENT='1월 상담 키워드 월 단위 집계 테이블';

CREATE TABLE tb_bach_2m (
    bach_2m_seq BIGINT(20) NOT NULL COMMENT '2월 집계 데이터 식별자',
    yy VARCHAR(4) NOT NULL DEFAULT '' COMMENT '집계 기준 연도',
    mm VARCHAR(2) NOT NULL DEFAULT '' COMMENT '집계 기준 월',
    dd VARCHAR(2) NOT NULL DEFAULT '' COMMENT '집계 기준 일',
    hh VARCHAR(2) NOT NULL DEFAULT '' COMMENT '집계 기준 시각',
    wk VARCHAR(1) DEFAULT NULL COMMENT '요일 코드',
    gu VARCHAR(50) NOT NULL DEFAULT '' COMMENT '서울시 자치구 명',
    dong VARCHAR(50) NOT NULL DEFAULT '' COMMENT '자치구 하위 동 명',
    keyword VARCHAR(50) NOT NULL DEFAULT '' COMMENT '집계 대상 키워드',
    count INT(11) DEFAULT 0 COMMENT '키워드 누적 발생 건수',
    PRIMARY KEY (bach_2m_seq)
) COMMENT='2월 상담 키워드 월 단위 집계 테이블';


CREATE TABLE tb_bach_3m (
    bach_3m_seq BIGINT(20) NOT NULL COMMENT '3월 집계 데이터 식별자',
    yy VARCHAR(4) NOT NULL DEFAULT '' COMMENT '집계 기준 연도',
    mm VARCHAR(2) NOT NULL DEFAULT '' COMMENT '집계 기준 월',
    dd VARCHAR(2) NOT NULL DEFAULT '' COMMENT '집계 기준 일',
    hh VARCHAR(2) NOT NULL DEFAULT '' COMMENT '집계 기준 시각',
    wk VARCHAR(1) DEFAULT NULL COMMENT '요일 코드',
    gu VARCHAR(50) NOT NULL DEFAULT '' COMMENT '서울시 자치구 명',
    dong VARCHAR(50) NOT NULL DEFAULT '' COMMENT '자치구 하위 동 명',
    keyword VARCHAR(50) NOT NULL DEFAULT '' COMMENT '집계 대상 키워드',
    count INT(11) DEFAULT 0 COMMENT '키워드 누적 발생 건수',
    PRIMARY KEY (bach_3m_seq)
) COMMENT='3월 상담 키워드 월 단위 집계 테이블';

CREATE TABLE tb_bach_4m (
    bach_4m_seq BIGINT(20) NOT NULL COMMENT '4월 집계 데이터 식별자',
    yy VARCHAR(4) NOT NULL DEFAULT '' COMMENT '집계 기준 연도',
    mm VARCHAR(2) NOT NULL DEFAULT '' COMMENT '집계 기준 월',
    dd VARCHAR(2) NOT NULL DEFAULT '' COMMENT '집계 기준 일',
    hh VARCHAR(2) NOT NULL DEFAULT '' COMMENT '집계 기준 시각',
    wk VARCHAR(1) DEFAULT NULL COMMENT '요일 코드',
    gu VARCHAR(50) NOT NULL DEFAULT '' COMMENT '서울시 자치구 명',
    dong VARCHAR(50) NOT NULL DEFAULT '' COMMENT '자치구 하위 동 명',
    keyword VARCHAR(50) NOT NULL DEFAULT '' COMMENT '집계 대상 키워드',
    count INT(11) DEFAULT 0 COMMENT '키워드 누적 발생 건수',
    PRIMARY KEY (bach_4m_seq)
) COMMENT='4월 상담 키워드 월 단위 집계 테이블';

CREATE TABLE tb_bach_5m (
    bach_5m_seq BIGINT(20) NOT NULL COMMENT '5월 집계 데이터 식별자',
    yy VARCHAR(4) NOT NULL DEFAULT '' COMMENT '집계 기준 연도',
    mm VARCHAR(2) NOT NULL DEFAULT '' COMMENT '집계 기준 월',
    dd VARCHAR(2) NOT NULL DEFAULT '' COMMENT '집계 기준 일',
    hh VARCHAR(2) NOT NULL DEFAULT '' COMMENT '집계 기준 시각',
    wk VARCHAR(1) DEFAULT NULL COMMENT '요일 코드',
    gu VARCHAR(50) NOT NULL DEFAULT '' COMMENT '서울시 자치구 명',
    dong VARCHAR(50) NOT NULL DEFAULT '' COMMENT '자치구 하위 동 명',
    keyword VARCHAR(50) NOT NULL DEFAULT '' COMMENT '집계 대상 키워드',
    count INT(11) DEFAULT 0 COMMENT '키워드 누적 발생 건수',
    PRIMARY KEY (bach_5m_seq)
) COMMENT='5월 상담 키워드 월 단위 집계 테이블';

CREATE TABLE tb_bach_6m (
    bach_6m_seq BIGINT(20) NOT NULL COMMENT '6월 집계 데이터 식별자',
    yy VARCHAR(4) NOT NULL DEFAULT '' COMMENT '집계 기준 연도',
    mm VARCHAR(2) NOT NULL DEFAULT '' COMMENT '집계 기준 월',
    dd VARCHAR(2) NOT NULL DEFAULT '' COMMENT '집계 기준 일',
    hh VARCHAR(2) NOT NULL DEFAULT '' COMMENT '집계 기준 시각',
    wk VARCHAR(1) DEFAULT NULL COMMENT '요일 코드',
    gu VARCHAR(50) NOT NULL DEFAULT '' COMMENT '서울시 자치구 명',
    dong VARCHAR(50) NOT NULL DEFAULT '' COMMENT '자치구 하위 동 명',
    keyword VARCHAR(50) NOT NULL DEFAULT '' COMMENT '집계 대상 키워드',
    count INT(11) DEFAULT 0 COMMENT '키워드 누적 발생 건수',
    PRIMARY KEY (bach_6m_seq)
) COMMENT='6월 상담 키워드 월 단위 집계 테이블';

CREATE TABLE tb_bach_7m (
    bach_7m_seq BIGINT(20) NOT NULL COMMENT '7월 집계 데이터 식별자',
    yy VARCHAR(4) NOT NULL DEFAULT '' COMMENT '집계 기준 연도',
    mm VARCHAR(2) NOT NULL DEFAULT '' COMMENT '집계 기준 월',
    dd VARCHAR(2) NOT NULL DEFAULT '' COMMENT '집계 기준 일',
    hh VARCHAR(2) NOT NULL DEFAULT '' COMMENT '집계 기준 시각',
    wk VARCHAR(1) DEFAULT NULL COMMENT '요일 코드',
    gu VARCHAR(50) NOT NULL DEFAULT '' COMMENT '서울시 자치구 명',
    dong VARCHAR(50) NOT NULL DEFAULT '' COMMENT '자치구 하위 동 명',
    keyword VARCHAR(50) NOT NULL DEFAULT '' COMMENT '집계 대상 키워드',
    count INT(11) DEFAULT 0 COMMENT '키워드 누적 발생 건수',
    PRIMARY KEY (bach_7m_seq)
) COMMENT='7월 상담 키워드 월 단위 집계 테이블';

CREATE TABLE tb_bach_8m (
    bach_8m_seq BIGINT(20) NOT NULL COMMENT '8월 집계 데이터 식별자',
    yy VARCHAR(4) NOT NULL DEFAULT '' COMMENT '집계 기준 연도',
    mm VARCHAR(2) NOT NULL DEFAULT '' COMMENT '집계 기준 월',
    dd VARCHAR(2) NOT NULL DEFAULT '' COMMENT '집계 기준 일',
    hh VARCHAR(2) NOT NULL DEFAULT '' COMMENT '집계 기준 시각',
    wk VARCHAR(1) DEFAULT NULL COMMENT '요일 코드',
    gu VARCHAR(50) NOT NULL DEFAULT '' COMMENT '서울시 자치구 명',
    dong VARCHAR(50) NOT NULL DEFAULT '' COMMENT '자치구 하위 동 명',
    keyword VARCHAR(50) NOT NULL DEFAULT '' COMMENT '집계 대상 키워드',
    count INT(11) DEFAULT 0 COMMENT '키워드 누적 발생 건수',
    PRIMARY KEY (bach_8m_seq)
) COMMENT='8월 상담 키워드 월 단위 집계 테이블';

CREATE TABLE tb_bach_9m (
    bach_9m_seq BIGINT(20) NOT NULL COMMENT '9월 집계 데이터 식별자',
    yy VARCHAR(4) NOT NULL DEFAULT '' COMMENT '집계 기준 연도',
    mm VARCHAR(2) NOT NULL DEFAULT '' COMMENT '집계 기준 월',
    dd VARCHAR(2) NOT NULL DEFAULT '' COMMENT '집계 기준 일',
    hh VARCHAR(2) NOT NULL DEFAULT '' COMMENT '집계 기준 시각',
    wk VARCHAR(1) DEFAULT NULL COMMENT '요일 코드',
    gu VARCHAR(50) NOT NULL DEFAULT '' COMMENT '서울시 자치구 명',
    dong VARCHAR(50) NOT NULL DEFAULT '' COMMENT '자치구 하위 동 명',
    keyword VARCHAR(50) NOT NULL DEFAULT '' COMMENT '집계 대상 키워드',
    count INT(11) DEFAULT 0 COMMENT '키워드 누적 발생 건수',
    PRIMARY KEY (bach_9m_seq)
) COMMENT='9월 상담 키워드 월 단위 집계 테이블';

CREATE TABLE tb_bach_10m (
    bach_10m_seq BIGINT(20) NOT NULL COMMENT '10월 집계 데이터 식별자',
    yy VARCHAR(4) NOT NULL DEFAULT '' COMMENT '집계 기준 연도',
    mm VARCHAR(2) NOT NULL DEFAULT '' COMMENT '집계 기준 월',
    dd VARCHAR(2) NOT NULL DEFAULT '' COMMENT '집계 기준 일',
    hh VARCHAR(2) NOT NULL DEFAULT '' COMMENT '집계 기준 시각',
    wk VARCHAR(1) DEFAULT NULL COMMENT '요일 코드',
    gu VARCHAR(50) NOT NULL DEFAULT '' COMMENT '서울시 자치구 명',
    dong VARCHAR(50) NOT NULL DEFAULT '' COMMENT '자치구 하위 동 명',
    keyword VARCHAR(50) NOT NULL DEFAULT '' COMMENT '집계 대상 키워드',
    count INT(11) DEFAULT 0 COMMENT '키워드 누적 발생 건수',
    PRIMARY KEY (bach_10m_seq)
) COMMENT='10월 상담 키워드 월 단위 집계 테이블';

CREATE TABLE tb_bach_11m (
    bach_11m_seq BIGINT(20) NOT NULL COMMENT '11월 집계 데이터 식별자',
    yy VARCHAR(4) NOT NULL DEFAULT '' COMMENT '집계 기준 연도',
    mm VARCHAR(2) NOT NULL DEFAULT '' COMMENT '집계 기준 월',
    dd VARCHAR(2) NOT NULL DEFAULT '' COMMENT '집계 기준 일',
    hh VARCHAR(2) NOT NULL DEFAULT '' COMMENT '집계 기준 시각',
    wk VARCHAR(1) DEFAULT NULL COMMENT '요일 코드',
    gu VARCHAR(50) NOT NULL DEFAULT '' COMMENT '서울시 자치구 명',
    dong VARCHAR(50) NOT NULL DEFAULT '' COMMENT '자치구 하위 동 명',
    keyword VARCHAR(50) NOT NULL DEFAULT '' COMMENT '집계 대상 키워드',
    count INT(11) DEFAULT 0 COMMENT '키워드 누적 발생 건수',
    PRIMARY KEY (bach_11m_seq)
) COMMENT='11월 상담 키워드 월 단위 집계 테이블';

CREATE TABLE tb_bach_12m (
    bach_12m_seq BIGINT(20) NOT NULL COMMENT '12월 집계 데이터 식별자',
    yy VARCHAR(4) NOT NULL DEFAULT '' COMMENT '집계 기준 연도',
    mm VARCHAR(2) NOT NULL DEFAULT '' COMMENT '집계 기준 월',
    dd VARCHAR(2) NOT NULL DEFAULT '' COMMENT '집계 기준 일',
    hh VARCHAR(2) NOT NULL DEFAULT '' COMMENT '집계 기준 시각',
    wk VARCHAR(1) DEFAULT NULL COMMENT '요일 코드',
    gu VARCHAR(50) NOT NULL DEFAULT '' COMMENT '서울시 자치구 명',
    dong VARCHAR(50) NOT NULL DEFAULT '' COMMENT '자치구 하위 동 명',
    keyword VARCHAR(50) NOT NULL DEFAULT '' COMMENT '집계 대상 키워드',
    count INT(11) DEFAULT 0 COMMENT '키워드 누적 발생 건수',
    PRIMARY KEY (bach_12m_seq)
) COMMENT='12월 상담 키워드 월 단위 집계 테이블'; 



/* 월 집계 조회 핵심 인덱스 */
CREATE INDEX idx_bach_1m_main ON tb_bach_1m (yy, mm, gu, keyword);
CREATE INDEX idx_bach_2m_main ON tb_bach_2m (yy, mm, gu, keyword);
CREATE INDEX idx_bach_3m_main ON tb_bach_3m (yy, mm, gu, keyword);
CREATE INDEX idx_bach_4m_main ON tb_bach_4m (yy, mm, gu, keyword);
CREATE INDEX idx_bach_5m_main ON tb_bach_5m (yy, mm, gu, keyword);
CREATE INDEX idx_bach_6m_main ON tb_bach_6m (yy, mm, gu, keyword);
CREATE INDEX idx_bach_7m_main ON tb_bach_7m (yy, mm, gu, keyword);
CREATE INDEX idx_bach_8m_main ON tb_bach_8m (yy, mm, gu, keyword);
CREATE INDEX idx_bach_9m_main ON tb_bach_9m (yy, mm, gu, keyword);
CREATE INDEX idx_bach_10m_main ON tb_bach_10m (yy, mm, gu, keyword);
CREATE INDEX idx_bach_11m_main ON tb_bach_11m (yy, mm, gu, keyword);
CREATE INDEX idx_bach_12m_main ON tb_bach_12m (yy, mm, gu, keyword);

CREATE INDEX idx_bach_1m_region ON tb_bach_1m (gu, dong); 
CREATE INDEX idx_bach_2m_region ON tb_bach_2m (gu, dong);
CREATE INDEX idx_bach_3m_region ON tb_bach_3m (gu, dong);
CREATE INDEX idx_bach_4m_region ON tb_bach_4m (gu, dong);
CREATE INDEX idx_bach_5m_region ON tb_bach_5m (gu, dong);
CREATE INDEX idx_bach_6m_region ON tb_bach_6m (gu, dong);
CREATE INDEX idx_bach_7m_region ON tb_bach_7m (gu, dong);
CREATE INDEX idx_bach_8m_region ON tb_bach_8m (gu, dong);
CREATE INDEX idx_bach_9m_region ON tb_bach_9m (gu, dong);
CREATE INDEX idx_bach_10m_region ON tb_bach_10m (gu, dong);
CREATE INDEX idx_bach_11m_region ON tb_bach_11m (gu, dong);
CREATE INDEX idx_bach_12m_region ON tb_bach_12m (gu, dong);

CREATE INDEX idx_bach_1m_keyword ON tb_bach_1m (keyword);
CREATE INDEX idx_bach_2m_keyword ON tb_bach_2m (keyword);
CREATE INDEX idx_bach_3m_keyword ON tb_bach_3m (keyword);
CREATE INDEX idx_bach_4m_keyword ON tb_bach_4m (keyword);
CREATE INDEX idx_bach_5m_keyword ON tb_bach_5m (keyword);
CREATE INDEX idx_bach_6m_keyword ON tb_bach_6m (keyword);
CREATE INDEX idx_bach_7m_keyword ON tb_bach_7m (keyword);
CREATE INDEX idx_bach_8m_keyword ON tb_bach_8m (keyword);
CREATE INDEX idx_bach_9m_keyword ON tb_bach_9m (keyword);
CREATE INDEX idx_bach_10m_keyword ON tb_bach_10m (keyword);
CREATE INDEX idx_bach_11m_keyword ON tb_bach_11m (keyword);
CREATE INDEX idx_bach_12m_keyword ON tb_bach_12m (keyword);

CREATE INDEX idx_bach_1m_wk ON tb_bach_1m (wk);
CREATE INDEX idx_bach_2m_wk ON tb_bach_2m (wk);
CREATE INDEX idx_bach_3m_wk ON tb_bach_3m (wk);
CREATE INDEX idx_bach_4m_wk ON tb_bach_4m (wk);
CREATE INDEX idx_bach_5m_wk ON tb_bach_5m (wk);
CREATE INDEX idx_bach_6m_wk ON tb_bach_6m (wk);
CREATE INDEX idx_bach_7m_wk ON tb_bach_7m (wk);
CREATE INDEX idx_bach_8m_wk ON tb_bach_8m (wk);
CREATE INDEX idx_bach_9m_wk ON tb_bach_9m (wk);
CREATE INDEX idx_bach_10m_wk ON tb_bach_10m (wk);
CREATE INDEX idx_bach_11m_wk ON tb_bach_11m (wk);
CREATE INDEX idx_bach_12m_wk ON tb_bach_12m (wk);
