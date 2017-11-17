(ns trex.physics-test
  (:require-macros [cljs.test :refer [deftest testing is]])
  (:require [cljs.test :as t]
            [trex.physics :refer [rigid-body
                                  sumv
                                  apply-force
                                  apply-impulse
                                  calculate]]))

(deftest physics-engine []
  (is (= (sumv [1 2] [3 4]) [4 6]))
  (is (= (sumv [1 2] [3 4] [.5 1.5]) [4.5 7.5])))

(deftest newton-laws []
  (testing "applies forces"
    (let [ball (rigid-body 10)
          f1 [1 1]
          f2 [2 3]
          actual (-> ball
                     (apply-force f1)
                     (apply-force f2))]
      (is (= [f1 f2] (:forces actual)))))

  (testing "applies impulses"
    (let [ball (rigid-body 10)
          f1 [1 1]
          f2 [1 1]
          actual (-> ball
                     (apply-impulse f1)
                     (apply-impulse f2))]
      (is (= [f1 f2] (:impulses actual)))))

  (testing "An object at rest stays at rest and an object in motion stays in motion"
    (let [rock (rigid-body 100)]
      (is (= rock (calculate rock 2)))))

  (testing "moves object when no force is applyied and object was moving"
    (let [velocity [1 2]
          ball (rigid-body 10 {:velocity velocity})
          expected (rigid-body 10 {:velocity velocity
                                   :location [2 4]})]
      (is (= (calculate ball 2) expected))))

  (testing (str "defines if a total force F acts on an object of mass m, "
                "that object will necessarily accelerate with acceleration a = F / m.")
    (let [ball (apply-force (rigid-body 10) [10 20])
          expected (rigid-body 10 {:velocity [1 2]
                                   :location [1 2]
                                   :forces [[10 20]]})]
      (is (= (calculate ball 1) expected)))))

(deftest jump []
  (let [g -10
        j 20
        gravity-force [0 g]
        jump-force [0 j]
        ball-mass 10
        ball (-> (rigid-body ball-mass)
                 (apply-force gravity-force)
                 (apply-impulse jump-force))
        velocity1s [0 1]
        location1s [0 1]]
    (testing "recalculates jumping body after 1s (with 1s step)"
      (is (= (calculate ball 1) (merge ball {:velocity velocity1s
                                             :location location1s
                                             :impulses []}))))
    (testing "recalculates jumping body after 2s (with 1s step)"
      (let [velocity2s [0 0]
            location2s [0 1]
            expected (merge ball {:velocity velocity2s
                                  :location location2s
                                  :impulses []})]
        (is (= expected (-> ball (calculate 1) (calculate 1))))))))


