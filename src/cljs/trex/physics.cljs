(ns trex.physics)

(def sumv (partial mapv +))

(defn multiplyv [t [x y]]
  [(* x t) (* y t)])

(defn apply-force [body f]
  (update body :forces conj f))

(defn apply-impulse [body i]
  (update body :impulses conj i))

(defn rigid-body [mass & [opts]]
  (merge {:mass mass
          :location [0 0]
          :velocity [0 0]
          :forces []
          :impulses []}
         opts))

(defn calculate [body t]
  (let [acceleration (->> (apply sumv (:forces body))
                          (multiplyv (/ 1 (:mass body))))
        impulses (->> (apply sumv (:impulses body))
                      (multiplyv (/ 1 (:mass body))))
        velocity (sumv (:velocity body)
                       (multiplyv t acceleration)
                       (multiplyv t impulses))]
    (-> body
        (assoc :velocity velocity)
        (assoc :impulses [])
        (assoc :location  (sumv (:location body)
                                (multiplyv t velocity))))))

