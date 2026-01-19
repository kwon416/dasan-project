INSERT INTO tb_real_time
(real_time_seq, yy, mm, dd, hh, keyword, call_id)
VALUES
(1, '2026', '01', '18', '09', '주차', 'CALL-RT-001'),
(2, '2026', '01', '18', '09', '소음', 'CALL-RT-002'),
(3, '2026', '01', '18', '10', '불법주정차', 'CALL-RT-003'),
(4, '2026', '01', '18', '10', '주차', 'CALL-RT-004'),
(5, '2026', '01', '18', '11', '쓰레기', 'CALL-RT-005');

INSERT INTO tb_real_mon (real_mon_seq, keyword, count)
VALUES
(1, '주차', 12),
(2, '소음', 7),
(3, '불법주정차', 5);

INSERT INTO tb_real_tue (real_tue_seq, keyword, count)
VALUES
(1, '주차', 9),
(2, '쓰레기', 6);

INSERT INTO tb_real_wed (real_wed_seq, keyword, count)
VALUES
(1, '소음', 11);

INSERT INTO tb_real_thu (real_thu_seq, keyword, count)
VALUES
(1, '불법주정차', 8);

INSERT INTO tb_real_fri (real_fri_seq, keyword, count)
VALUES
(1, '주차', 15);

INSERT INTO tb_real_sat (real_sat_seq, keyword, count)
VALUES
(1, '쓰레기', 10);

INSERT INTO tb_real_sun (real_sun_seq, keyword, count)
VALUES
(1, '소음', 4);


INSERT INTO tb_bach_consultation
(bach_consultation_seq, yy, mm, dd, hh, wk, gu, dong, keyword, call_id)
VALUES
(1, '2026', '01', '15', '10', '3', '강남구', '역삼동', '주차', 'CALL-B-001'),
(2, '2026', '01', '15', '11', '3', '강남구', '역삼동', '소음', 'CALL-B-002'),
(3, '2026', '01', '16', '09', '4', '서초구', '서초동', '불법주정차', 'CALL-B-003'),
(4, '2026', '01', '17', '14', '5', '마포구', '공덕동', '쓰레기', 'CALL-B-004');


INSERT INTO tb_bach_1m
(bach_1m_seq, yy, mm, dd, hh, wk, gu, dong, keyword, count)
VALUES
(1, '2026', '01', '15', '10', '3', '강남구', '역삼동', '주차', 20),
(2, '2026', '01', '15', '11', '3', '강남구', '역삼동', '소음', 12),
(3, '2026', '01', '16', '09', '4', '서초구', '서초동', '불법주정차', 9);

INSERT INTO tb_bach_2m
(bach_2m_seq, yy, mm, dd, hh, wk, gu, dong, keyword, count)
VALUES
(1, '2026', '02', '03', '13', '2', '마포구', '공덕동', '쓰레기', 14);
