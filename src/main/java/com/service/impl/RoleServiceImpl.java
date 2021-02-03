package com.service.impl;

import com.repo.RoleRepo;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.model.Role;
import com.service.RoleService;

@Service
@Transactional
public class RoleServiceImpl implements RoleService {

    private final RoleRepo roleRepo;

    public RoleServiceImpl(RoleRepo roleRepo){
        this.roleRepo = roleRepo;
    }

    @Override
    public Role getRoleByName(String role) {
        return roleRepo.findRoleByRolename(role);
    }

}
